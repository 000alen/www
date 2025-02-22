import numpy as np
import numpy.typing as npt
import random
from typing import TypedDict, List, Dict, Tuple, Any, cast
from enum import IntEnum


GRID_WIDTH = 10
GRID_HEIGHT = 20


class Action(IntEnum):
    LEFT = 0
    RIGHT = 1
    DOWN = 2
    ROTATE = 3


class TetrominoPiece(TypedDict):
    shape: npt.NDArray[np.int_]
    id: int


class ActivePiece(TypedDict):
    shape: npt.NDArray[np.int_]
    id: int
    x: int
    y: int


class TetrisEnvironment:
    grid: npt.NDArray[np.int_]
    score: int
    game_over: bool
    GRID_WIDTH: int
    GRID_HEIGHT: int
    tetrominos: Dict[str, TetrominoPiece]
    action_space: List[Action]
    active_piece: ActivePiece

    def __init__(self):
        # Dimensions of the grid.
        self.GRID_WIDTH = GRID_WIDTH
        self.GRID_HEIGHT = GRID_HEIGHT

        # Define tetromino shapes.
        # We use a simple integer id for each tetromino (color is not needed for RL).
        self.tetrominos = {
            "I": {"shape": np.array([[1, 1, 1, 1]]), "id": 1},
            "O": {"shape": np.array([[1, 1], [1, 1]]), "id": 2},
            "T": {"shape": np.array([[0, 1, 0], [1, 1, 1]]), "id": 3},
            "S": {"shape": np.array([[0, 1, 1], [1, 1, 0]]), "id": 4},
            "Z": {"shape": np.array([[1, 1, 0], [0, 1, 1]]), "id": 5},
            "J": {"shape": np.array([[1, 0, 0], [1, 1, 1]]), "id": 6},
            "L": {"shape": np.array([[0, 0, 1], [1, 1, 1]]), "id": 7},
        }

        # Define action space:
        # 0: move left, 1: move right, 2: move down, 3: rotate
        self.action_space = [Action.LEFT, Action.RIGHT, Action.DOWN, Action.ROTATE]

        self.reset()

    def reset(self) -> npt.NDArray[np.int_]:
        # Reset the grid, score, and game over flag.
        self.grid = np.zeros((self.GRID_HEIGHT, self.GRID_WIDTH), dtype=int)
        self.score = 0
        self.game_over = False
        self._spawn_piece()
        return self.get_state()

    def get_state(self) -> npt.NDArray[np.int_]:
        # Return a copy of the grid with the active piece overlaid.
        state = self.grid.copy()
        piece = self.active_piece
        shape = piece["shape"]
        for i in range(shape.shape[0]):
            for j in range(shape.shape[1]):
                if shape[i, j]:
                    x = piece["x"] + j
                    y = piece["y"] + i
                    if 0 <= x < self.GRID_WIDTH and 0 <= y < self.GRID_HEIGHT:
                        state[y, x] = piece["id"]
        return state

    def _spawn_piece(self) -> None:
        # Randomly choose a tetromino and initialize its position.
        key = random.choice(list(self.tetrominos.keys()))
        tetromino = self.tetrominos[key]
        shape = tetromino["shape"].copy()
        x = (self.GRID_WIDTH - shape.shape[1]) // 2
        y = 0
        self.active_piece = {"shape": shape, "id": tetromino["id"], "x": x, "y": y}

    def _check_collision(self, x: int, y: int, shape: npt.NDArray[np.int_]) -> bool:
        # Check for collision with walls or the filled grid cells.
        for i in range(shape.shape[0]):
            for j in range(shape.shape[1]):
                if shape[i, j]:
                    new_x = x + j
                    new_y = y + i
                    # Out of bounds
                    if (
                        new_x < 0
                        or new_x >= self.GRID_WIDTH
                        or new_y < 0
                        or new_y >= self.GRID_HEIGHT
                    ):
                        return True
                    # Collision with already placed piece.
                    if self.grid[new_y, new_x] != 0:
                        return True
        return False

    def _rotate(self, shape: npt.NDArray[np.int_]) -> npt.NDArray[np.int_]:
        # Rotate the shape counter-clockwise.
        return np.rot90(shape)

    def _place_piece(self) -> int:
        # Place the active piece into the grid.
        piece = self.active_piece
        shape = piece["shape"]
        x, y = piece["x"], piece["y"]
        for i in range(shape.shape[0]):
            for j in range(shape.shape[1]):
                if shape[i, j]:
                    self.grid[y + i, x + j] = piece["id"]
        cleared, self.grid = self._clear_rows(self.grid)
        self.score += cleared * 100
        return cleared

    def _clear_rows(
        self, grid: npt.NDArray[np.int_]
    ) -> Tuple[int, npt.NDArray[np.int_]]:
        # Remove full rows and return the number of rows cleared along with the new grid.
        new_grid: List[np.ndarray] = []
        cleared = 0
        for row in grid:
            if np.all(row != 0):
                cleared += 1
            else:
                new_grid.append(row)
        # Add empty rows at the top for each cleared row.
        for _ in range(cleared):
            new_grid.insert(0, np.zeros(self.GRID_WIDTH, dtype=np.int_))
        new_grid_array = cast(npt.NDArray[np.int_], np.array(new_grid, dtype=np.int_))
        return cleared, new_grid_array

    def step(
        self, action: Action
    ) -> Tuple[npt.NDArray[np.int_], float, bool, Dict[str, Any]]:
        """
        Perform an action.
        Actions:
          0: move left
          1: move right
          2: move down
          3: rotate

        Returns:
          state: the new state (grid with active piece)
          reward: the reward obtained from this step
          done: whether the game is over
          info: optional diagnostic info (empty dict here)
        """
        reward = 0

        if self.game_over:
            return self.get_state(), reward, True, {}

        piece = self.active_piece
        x, y, shape = piece["x"], piece["y"], piece["shape"]

        if action == Action.LEFT:  # Move left
            if not self._check_collision(x - 1, y, shape):
                piece["x"] -= 1
        elif action == Action.RIGHT:  # Move right
            if not self._check_collision(x + 1, y, shape):
                piece["x"] += 1
        elif action == Action.DOWN:  # Move down
            if self._check_collision(x, y + 1, shape):
                # Cannot move down; place piece and spawn a new one.
                cleared = self._place_piece()
                reward += cleared * 10  # Reward for clearing rows.
                self._spawn_piece()
                # Check if the new piece immediately collides (game over).
                if self._check_collision(
                    self.active_piece["x"],
                    self.active_piece["y"],
                    self.active_piece["shape"],
                ):
                    self.game_over = True
                    reward -= 100
            else:
                piece["y"] += 1
        elif action == Action.ROTATE:  # Rotate
            rotated = self._rotate(shape)
            if not self._check_collision(x, y, rotated):
                piece["shape"] = rotated

        # Optional: apply automatic gravity if the action was not "down."
        if action != 2 and not self.game_over:
            if self._check_collision(piece["x"], piece["y"] + 1, piece["shape"]):
                cleared = self._place_piece()
                reward += cleared * 10
                self._spawn_piece()
                if self._check_collision(
                    self.active_piece["x"],
                    self.active_piece["y"],
                    self.active_piece["shape"],
                ):
                    self.game_over = True
                    reward -= 100
            else:
                piece["y"] += 1

        state = self.get_state()
        done = self.game_over
        info: Dict[str, Any] = {}
        return state, reward, done, info


# For testing the environment independently.
if __name__ == "__main__":
    env = TetrisEnvironment()
    state = env.reset()
    done = False
    step_count = 0
    while not done:
        # For testing purposes, take a random action.
        action = random.choice(env.action_space)
        state, reward, done, _ = env.step(action)
        step_count += 1
        print(f"Step: {step_count} | Score: {env.score} | Reward: {reward}")
        print(state)
    print("Game Over!")
