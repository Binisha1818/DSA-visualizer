"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "./sidebar.css";
export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Burger Button */}
      <button
        className={`sidebar-burger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

        <div className="sidebar-section">
          <div className="sidebar-title">LEARN</div>

          <div className="sidebar-heading">
            Algorithms
          </div>

          <Link
            href="/algorithms/sorting"
            className={
              pathname === "/algorithms/sorting" ? "active" : ""
            }
            onClick={closeSidebar}
          >
            Sorting
          </Link>

          <div className="sidebar-submenu">

            <Link
              href="/algorithms/sorting"
              className={
                pathname === "/algorithms/sorting"
                  ? "active"
                  : ""
              }
              onClick={closeSidebar}
            >
              Bubble Sort
            </Link>

            <Link
              href="/algorithms/sorting/selectionsort"
              className={
                pathname === "/algorithms/sorting/selectionsort"
                  ? "active"
                  : ""
              }
              onClick={closeSidebar}
            >
              Selection Sort
            </Link>

          </div>

          <Link
            href="/algorithms/searching"
            className={
              pathname === "/algorithms/searching" ? "active" : ""
            }
            onClick={closeSidebar}
          >
            Searching
          </Link>

          <div className="sidebar-submenu">

            <Link
              href="/algorithms/searching/binarysearch"
              className={
                pathname === "/algorithms/searching/binarysearch"
                  ? "active"
                  : ""
              }
              onClick={closeSidebar}
            >
              Binary Search
            </Link>

            <Link
              href="/algorithms/searching/linearSearch"
              className={
                pathname === "/algorithms/searching/linearSearch"
                  ? "active"
                  : ""
              }
              onClick={closeSidebar}
            >
              Linear Search
            </Link>

          </div>

          <Link
            href="/algorithms/TwoPointer"
            className={
              pathname === "/algorithms/TwoPointer" ? "active" : ""
            }
            onClick={closeSidebar}
          >
            Two Pointer
          </Link>

          <Link
            href="/algorithms/IntervalMerging"
            className={
              pathname === "/algorithms/IntervalMerging"
                ? "active"
                : ""
            }
            onClick={closeSidebar}
          >
            Interval Merging
          </Link>

          <Link
            href="/algorithms/dynamicProgramming"
            className={
              pathname === "/algorithms/dynamicProgramming"
                ? "active"
                : ""
            }
            onClick={closeSidebar}
          >
            Dynamic Programming
          </Link>

          <Link
            href="/algorithms/graph"
            className={
              pathname === "/algorithms/graph" ? "active" : ""
            }
            onClick={closeSidebar}
          >
            Graph
          </Link>

          <div className="sidebar-submenu">

            <Link
              href="/algorithms/graphs/bfs"
              className={
                pathname === "/algorithms/graphs/bfs" ? "active" : ""
              }
              onClick={closeSidebar}
            >
              BFS
            </Link>

            <Link
              href="/algorithms/graphs/dfs"
              className={
                pathname === "/algorithms/graphs/dfs" ? "active" : ""
              }
              onClick={closeSidebar}
            >
              DFS
            </Link>

            <Link
              href="/algorithms/graphs/dijkstra"
              className={
                pathname === "/algorithms/graphs/dijkstra"
                  ? "active"
                  : ""
              }
              onClick={closeSidebar}
            >
              Dijkstra
            </Link>

          </div>
        </div>


        {/* DATA STRUCTURES */}
        <div className="sidebar-section">

          <div className="sidebar-title">
            DATA STRUCTURES
          </div>

          <Link
            href="/DataStructure/Array"
            className={
              pathname === "/DataStructure/Array" ? "active" : ""
            }
            onClick={closeSidebar}
          >
            Arrays
          </Link>

          <Link
            href="/DataStructure/linkedlist"
            className={
              pathname === "/DataStructure/linkedlist"
                ? "active"
                : ""
            }
            onClick={closeSidebar}
          >
            Linked List
          </Link>

          <Link
            href="/DataStructure/stack"
            className={
              pathname === "/DataStructure/stack" ? "active" : ""
            }
            onClick={closeSidebar}
          >
            Stack
          </Link>

          <Link
            href="/data-structures/queue"
            className={
              pathname === "/data-structures/queue" ? "active" : ""
            }
            onClick={closeSidebar}
          >
            Queue
          </Link>

          <Link
            href="/data-structures/trees"
            className={
              pathname === "/data-structures/trees" ? "active" : ""
            }
            onClick={closeSidebar}
          >
            Trees
          </Link>

          <Link
            href="/DataStructure/hashmap"
            className={
              pathname === "/DataStructure/hashmap" ? "active" : ""
            }
            onClick={closeSidebar}
          >
            HashMap
          </Link>

        </div>

      </aside>
    </>
  );
}