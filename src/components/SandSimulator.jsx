import "../styles/SandSimulator.css";
import React, { useState, useEffect } from "react";
import Sketch from "react-p5";

export function SandSimulator() {
    const [width, setWidth] = useState(500);
    const [height, setHeight] = useState(500);
    const [cellSize, setCellSize] = useState(20); 
    const [grid, setGrid] = useState(
        Array.from({ length: Math.floor(500 / 20) }, () => Array(Math.floor(500 / 20)).fill(false))
    );

    useEffect(() => {
        const interval = setInterval(() => {
            updateSandPhysics();
        }, 100);
        return () => clearInterval(interval);
    }, [grid]);

    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(width, height).parent(canvasParentRef);
    };

    const draw = (p5) => {
        p5.background(50);

        // Draw grid
        for (let y = 0; y < height; y += cellSize) {
            for (let x = 0; x < width; x += cellSize) {
                const cellX = Math.floor(x / cellSize);
                const cellY = Math.floor(y / cellSize);

                if (grid[cellY][cellX]) {
                    p5.fill(255);
                } else {
                    p5.fill(30);
                }

                p5.stroke(80);
                p5.rect(x, y, cellSize, cellSize);
            }
        }
    };

    const mousePressed = (p5) => {
        const x = Math.floor(p5.mouseX / cellSize);
        const y = Math.floor(p5.mouseY / cellSize);

        if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
            const newGrid = grid.map((row, rowIndex) =>
                row.map((cell, colIndex) =>
                    rowIndex === y && colIndex === x ? !cell : cell
                )
            );
            setGrid(newGrid);
        }
    };

    const updateSandPhysics = () => {
        const newGrid = grid.map(row => [...row]);

        for (let y = grid.length - 2; y >= 0; y--) {
            for (let x = 0; x < grid[0].length; x++) {
                if (grid[y][x]) {
                    if (!grid[y + 1][x]) { 
                        newGrid[y][x] = false;
                        newGrid[y + 1][x] = true;
                    } else if (x > 0 && !grid[y + 1][x - 1]) {
                        newGrid[y][x] = false;
                        newGrid[y + 1][x - 1] = true;
                    } else if (x < grid[0].length - 1 && !grid[y + 1][x + 1]) { 
                        newGrid[y][x] = false;
                        newGrid[y + 1][x + 1] = true;
                    }
                }
            }
        }

        setGrid(newGrid);
    };

    return (
        <Sketch
            className="sandSimulator"
            setup={setup}
            draw={draw}
            mousePressed={mousePressed}
        />
    );
}
