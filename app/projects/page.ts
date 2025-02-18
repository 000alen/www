import { NOTION_PROJECTS_URL } from "@/lib/constants";
import { redirect } from "next/navigation";

export default function Page() {
    redirect(NOTION_PROJECTS_URL);
}