import { useState } from "react";
import iconEllipsis from "../assets/icon-vertical-ellipsis.svg"
import type { MenuItem } from "../types"

export default function EllipsisMenu({ items }: { items: MenuItem[] }) {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div className="relative">
            <div
                className="inline-flex items-center justify-center p-1 -m-1 cursor-pointer"
                onClick={() => setMenuOpen((prev) => !prev)}
            >
                <img src={iconEllipsis} alt="ellipsis icon" className="h-3" />
            </div>

            {menuOpen && (
                <div
                    className={`absolute right-0 mt-2 w-40 bg-white shadow-lg rounded z-50`}
                >
                    {items.map((item, idx) => (
                        <button
                            key={idx}
                            className={`font-medium text-[13px] leading-[23px] block w-full text-left px-4 py-2 hover:bg-gray-100 
                                ${item.danger
                                    ? "text-[#EA5555]"
                                    : "text-medium-grey"
                                }`}
                            onClick={() => {
                                item.onClick()
                                setMenuOpen(false)
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )

}