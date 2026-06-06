import { describe, it, expect, vi } from "vitest";
import { findPath } from "./findPath";
import { floors, mergedData } from "../../constants/floors";
import { pathSeparator } from "./pathSeparator";
import dijkstrajs from "dijkstrajs";

// Mock the dependencies
vi.mock("../../constants/floors", () => ({
  floors: [0, 1, 2],
  mergedData: [
    { id: "A", floor: 0, neighbors: [{ id: "B", distance: 1 }] },
    {
      id: "B",
      floor: 0,
      neighbors: [
        { id: "A", distance: 1 },
        { id: "C", distance: 2 },
      ],
    },
    {
      id: "C",
      floor: 1,
      neighbors: [
        { id: "B", distance: 2 },
        { id: "D", distance: 3 },
      ],
    },
    {
      id: "D",
      floor: 1,
      neighbors: [
        { id: "C", distance: 3 },
        { id: "E", distance: 1 },
      ],
    },
    { id: "E", floor: 2, neighbors: [{ id: "D", distance: 1 }] },
  ],
}));

vi.mock("./pathSeparator", () => ({
  pathSeparator: vi.fn((floors, path) => {
    return floors
      .map((floor) => ({
        floor,
        path: path.filter(
          (id) => mergedData.find((item) => item.id === id).floor === floor,
        ),
      }))
      .filter((item) => item.path.length > 0);
  }),
}));

vi.mock("dijkstrajs", () => ({
  default: {
    find_path: vi.fn((graph, start, end) => ["A", "B", "C", "D", "E"]),
  },
}));

describe("findPath", () => {
  it("should return the correct path between two points", () => {
    const startPoint = { id: "A", floor: 0 };
    const endPoint = { id: "E", floor: 2 };

    const result = findPath(startPoint, endPoint);

    expect(result).toEqual([
      { floor: 0, path: ["A", "B"] },
      { floor: 1, path: ["C", "D"] },
      { floor: 2, path: ["E"] },
    ]);
  });

  it("should call dijkstrajs.find_path with correct parameters", () => {
    const startPoint = { id: "A", floor: 0 };
    const endPoint = { id: "E", floor: 2 };

    findPath(startPoint, endPoint);

    expect(dijkstrajs.find_path).toHaveBeenCalledWith(
      expect.any(Object),
      "A",
      "E",
    );
  });

  it("should call pathSeparator with correct parameters", () => {
    const startPoint = { id: "A", floor: 0 };
    const endPoint = { id: "E", floor: 2 };

    findPath(startPoint, endPoint);

    expect(pathSeparator).toHaveBeenCalledWith(floors, [
      "A",
      "B",
      "C",
      "D",
      "E",
    ]);
  });

  it("should handle a path within the same floor", () => {
    const startPoint = { id: "A", floor: 0 };
    const endPoint = { id: "B", floor: 0 };

    vi.mocked(dijkstrajs.find_path).mockReturnValueOnce(["A", "B"]);

    const result = findPath(startPoint, endPoint);

    expect(result).toEqual([{ floor: 0, path: ["A", "B"] }]);
  });

  it("should handle invalid start or end points", () => {
    const startPoint = { id: "X", floor: 0 };
    const endPoint = { id: "E", floor: 2 };
    const result = findPath(startPoint, endPoint);
    expect(result).toBeInstanceOf(Error);
  });
});
