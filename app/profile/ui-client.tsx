"use client"
import { Select, SelectItem } from "@nextui-org/react";
import { useTheme } from "next-themes";
export const ThemeSwitcher = () => {
    const { themes, setTheme } = useTheme();
    return (
        <Select
            className="max-w-xs"
            size="lg"
            placeholder="Select a theme"
            onChange={(e) => setTheme(e.target.value)}
            aria-label="Select theme"
        >
            <SelectItem key="system"
                value={"system"}
            > Auto</SelectItem>
            <SelectItem key="light" value={"light"}> Light</SelectItem>
            <SelectItem key="dark" value={"dark"}> Dark</SelectItem>


        </Select>
    )
}
