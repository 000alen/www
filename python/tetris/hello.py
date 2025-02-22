import numpy as np
import numpy.typing as npt
import random
from tinygrad.tensor import Tensor
from tinygrad import nn
from typing import List, Tuple, Any
from environment import TetrisEnvironment, GRID_HEIGHT, GRID_WIDTH


class QNetwork:
    def __init__(self, input_dim: int, hidden_dim: int, output_dim: int):
        # Two-layer fully connected network.
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self.output_dim = output_dim

        # Initialize weights using tinygrad's kaiming_uniform.
        self.l1 = Tensor.kaiming_uniform(input_dim, hidden_dim)
        self.l2 = Tensor.kaiming_uniform(hidden_dim, output_dim)

    def forward(self, x: Tensor) -> Tensor:
        # Forward pass: x should be (batch, input_dim)
        x = x.dot(self.l1).relu().dot(self.l2)
        return x

    def parameters(self) -> List[Tensor]:
        return [self.l1, self.l2]


# -----------------------------
# Replay Buffer
# -----------------------------
class ReplayBuffer:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.buffer: List[
            Tuple[npt.NDArray[np.int_], int, float, npt.NDArray[np.int_], bool]
        ] = []

    def add(
        self,
        state: npt.NDArray[np.int_],
        action: int,
        reward: float,
        next_state: npt.NDArray[np.int_],
        done: bool,
    ) -> None:
        if len(self.buffer) >= self.capacity:
            self.buffer.pop(0)
        self.buffer.append((state, action, reward, next_state, done))

    def sample(
        self, batch_size: int
    ) -> List[Tuple[npt.NDArray[np.int_], int, float, npt.NDArray[np.int_], bool]]:
        return random.sample(self.buffer, batch_size)

    def __len__(self) -> int:
        return len(self.buffer)


# -----------------------------
# Helper function to convert state to Tensor
# -----------------------------
def state_to_tensor(state: npt.NDArray[np.int_]) -> Tensor:
    # Flatten and convert to float32.
    # shape (1, input_dim)
    return Tensor(state.flatten().astype(np.float32)[None, :])


# -----------------------------
# Function to update target network
# -----------------------------
def update_target(agent: QNetwork, target: QNetwork) -> None:
    # Copy parameters from agent to target.
    for p_agent, p_target in zip(agent.parameters(), target.parameters()):
        arr = np.array(p_agent.data())
        p_target.assign(arr.copy())


# -----------------------------
# Training Loop
# -----------------------------
if __name__ == "__main__":
    with Tensor.train():
        # Hyperparameters
        num_episodes = 500
        batch_size = 32
        gamma = 0.99
        learning_rate = 0.001
        buffer_capacity = 10000
        target_update_interval = 10  # episodes between target network updates
        epsilon = 1.0
        epsilon_decay = 0.995
        min_epsilon = 0.1

        # Dimensions: state is a GRID_HEIGHT x GRID_WIDTH grid.
        # Our environment grid is 20x10, so input_dim = 200.
        input_dim = 20 * 10  # Adjust if your grid size is different.
        hidden_dim = 128
        output_dim = 4  # Number of actions: LEFT, RIGHT, DOWN, ROTATE

        # Initialize environment, agent, target network, optimizer, and replay buffer.
        env = TetrisEnvironment()
        agent = QNetwork(input_dim, hidden_dim, output_dim)
        target_agent = QNetwork(input_dim, hidden_dim, output_dim)
        update_target(agent, target_agent)
        optimizer = nn.optim.Adam(agent.parameters(), lr=learning_rate)
        replay_buffer = ReplayBuffer(buffer_capacity)

        # Training loop over episodes.
        for episode in range(num_episodes):
            state = env.reset()  # state shape: (20, 10)
            total_reward = 0.0
            done = False
            step_count = 0

            while not done:
                step_count += 1

                # Epsilon-greedy action selection.
                if random.random() < epsilon:
                    action = random.choice(env.action_space)
                else:
                    # Compute Q-values for current state.
                    state_tensor = state_to_tensor(state)  # shape (1, 200)
                    q_values = agent.forward(state_tensor)  # shape (1, 4)

                    print("got q values")
                    print(q_values)

                    # Choose action with highest Q-value.
                    action = int(q_values.data.argmax())

                # Take action in environment.
                next_state, reward, done, _ = env.step(action)
                total_reward += reward

                # Add transition to replay buffer.
                replay_buffer.add(state, action, reward, next_state, done)
                state = next_state

                # When enough samples are available, perform a training step.
                if len(replay_buffer) >= batch_size:
                    batch = replay_buffer.sample(batch_size)
                    # Prepare batch arrays.
                    states = np.array(
                        [s.flatten() for s, a, r, s_next, d in batch], dtype=np.float32
                    )
                    actions = np.array(
                        [a for s, a, r, s_next, d in batch], dtype=np.int32
                    )
                    rewards = np.array(
                        [r for s, a, r, s_next, d in batch], dtype=np.float32
                    )
                    next_states = np.array(
                        [s_next.flatten() for s, a, r, s_next, d in batch],
                        dtype=np.float32,
                    )
                    dones = np.array(
                        [d for s, a, r, s_next, d in batch], dtype=np.float32
                    )

                    # Convert to tensors.
                    states_t = Tensor(states)  # shape (batch, input_dim)
                    next_states_t = Tensor(next_states)  # shape (batch, input_dim)

                    # Compute Q-values for current states.
                    q_values = agent.forward(
                        states_t
                    ).numpy()  # shape (batch, output_dim)

                    print("got q values")
                    print(q_values)

                    # Gather Q-values for the actions taken.
                    q_current = []
                    for i in range(batch_size):
                        q_current.append(q_values[i, actions[i]])

                    q_current = Tensor(
                        np.array(q_current, dtype=np.float32).reshape(batch_size, 1)
                    )

                    # Compute target Q-values.
                    next_q_values = target_agent.forward(
                        next_states_t
                    ).numpy()  # shape (batch, output_dim)
                    max_next_q = np.max(next_q_values, axis=1)
                    targets = (
                        rewards + (1 - dones) * gamma * max_next_q
                    )  # shape (batch,)
                    targets = Tensor(targets.reshape(batch_size, 1))

                    # Compute Mean Squared Error loss.
                    loss = ((q_current - targets) ** 2).mean()

                    optimizer.zero_grad()
                    loss.backward()
                    optimizer.step()

            # Decay epsilon.
            epsilon = max(min_epsilon, epsilon * epsilon_decay)

            # Update target network every few episodes.
            if episode % target_update_interval == 0:
                update_target(agent, target_agent)

            print(
                f"Episode {episode} - Steps: {step_count} - Total Reward: {total_reward:.2f} - Epsilon: {epsilon:.3f}"
            )

        print("Training complete!")
