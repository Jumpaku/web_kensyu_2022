import * as Collections from "typescript-collections";
import { Pos } from "./blocks/geometry";

export interface CellSet {
  cells: Collections.Set<Pos>;
}

export function cellSetUnion(...cellSets: CellSet[]): CellSet {
  const cells = new Collections.Set<Pos>();
  cellSets
    .flatMap((cellSet) => cellSet.cells.toArray())
    .forEach((pos) => {
      cells.add(pos);
    });
  return { cells: cells };
}

export function cellSetIntersect(
  first: CellSet,
  ...cellSets: CellSet[]
): CellSet {
  if (cellSets.length === 1) return first!;
  const cells = new Collections.Set<Pos>();
  first.cells.forEach((pos) => {
    for (const tailCell of cellSets) {
      if (!tailCell.cells.contains(pos)) return;
    }
    cells.add(pos);
  });
  return { cells: cells };
}

export function cellSetRemove(original: CellSet, remove: CellSet): CellSet {
  const cells = new Collections.Set<Pos>();
  original.cells.forEach((elm) => {
    if (!remove.cells.contains(elm)) cells.add(elm);
  });
  return { cells: cells };
}
