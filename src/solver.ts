const dx = [0, 1, 0, -1]
const dy = [-1, 0 , 1, 0]

export const solveGrid = (grid: number[][]): number[][] | null => {
  const _grid: number[][] = []
  const q: number[][] = []  
  const gridColors: number[] = []

  const checkValidality = (grid: number[][]) => {
    // check degree
    let deg = 0
    let nextX = 0
    let nextY = 0
    for ( let i=0;i<grid.length;++i ) {
      for ( let j=0;j<grid[i].length;++j ) {
        deg = 0
        if ( grid[i][j] ) {
          for ( let k=0;k<4;++k ) {
            nextX = i + dx[k]
            nextY = j + dy[k]
            if ( 0 <= nextX && nextX < grid.length && 0 <= nextY && nextY < grid[0].length && Math.abs(grid[i][j]) === Math.abs(grid[nextX][nextY])) {
              deg += 1
            }
          }
        }
        if ( deg > 2 ) return false;
      }
    }

    // check color connectivity
    for ( let c of gridColors ) {
      // init
      for ( let i=0;i<grid.length;++i ) {
        if ( _grid[i] === undefined ) _grid[i] = []
        for ( let j=0;j<grid[i].length;++j ) {
          _grid[i][j] = Math.abs(grid[i][j]);
        }
      }

      // search BFS starting point
      q.length = 0
      for ( let i=0;i<_grid.length && q.length === 0;++i ) {
        for ( let j=0;j<_grid[i].length && q.length === 0;++j ) {
          if ( _grid[i][j] === c ) {
            q.push([i, j])
            _grid[i][j] = -1
          }
        }
      }

      // start bfs
      let h = 0
      nextX = 0
      nextY = 0
      while ( h < q.length ) {
        for ( let i=0;i<4;++i ) {
          nextX = q[h][0] + dx[i]
          nextY = q[h][1] + dy[i]
          if ( 0 <= nextX && nextX < grid.length && 0 <= nextY && nextY < grid[0].length && (
            _grid[nextX][nextY] === 0 || _grid[nextX][nextY] === c
          )) {
            _grid[nextX][nextY] = -1
            q.push([nextX, nextY])
          }
        }
        ++h;
      }

      // check outstanding color
      for ( let i=0;i<_grid.length;++i ) {
        for ( let j=0;j<_grid[i].length;++j ) {
          if ( _grid[i][j] === c ) return false;
        }
      }
    }
    return true;
  }

  // initGridColors
  let colors: Record<number, boolean> = {}
  for ( let i=0;i<grid.length;++i ) {
    for ( let j=0;j<grid[i].length;++j ) {
      if ( grid[i][j] ) colors[Math.abs(grid[i][j])] = true;
    }
  }
  gridColors.length = 0
  Object.keys(colors).forEach(c => gridColors.push(parseInt(c,10)))

  // define dfs
  const dfs = (cell: number): boolean => {
    if ( cell === grid.length * grid[0].length ) {
      return true
    }
    let x = Math.floor(cell / grid[0].length)
    let y = cell % grid[0].length
    if ( grid[x][y] === 0 ) {
      for ( let i of gridColors ) {
        grid[x][y] = i
        if ( checkValidality(grid) && dfs(cell+1) ) {
          return true
        }
      }
      grid[x][y] = 0
      return false
    }
    return dfs(cell + 1)
  }

  if ( dfs(0) ) {
    return grid
  } else {
    return null
  }
}

export const getSolvable = (grid: number[][]): number[][] => {
  if ( grid.length === 0 || grid[0].length === 0 ) {
    throw new Error("Invalid board size")
  }
  const ret: number[][] = [];
  const colors: Record<number, number> = {}
  let deg = 0 
  let nextX = 0 
  let nextY = 0
  let cur = 0
  for ( let i=0;i<grid.length;++i ) {
    ret[i] = []
    for ( let j=0;j<grid[i].length; ++j ) {
      cur = Math.abs(grid[i][j])
      if ( cur === 0 ) {
        throw new Error("Illegal board: Board not fully filled")
      }
      ret[i][j] = 0
      deg = 0
      for ( let k=0;k<4;++k ) {
        nextX = i + dx[k]
        nextY = j + dy[k]
        if ( 0 <= nextX && nextX < grid.length && 0 <= nextY && nextY < grid[0].length  && Math.abs(grid[nextX][nextY]) === Math.abs(cur)) {
          deg += 1
        }
      }
      if ( deg === 1 ) {
        ret[i][j] = -cur
        if ( colors[cur] === undefined ) colors[cur] = 0
        colors[cur] += 1
      } else if ( deg === 0 ) {
        throw new Error("Illegal board: Singular cluster found")
      } else if ( deg > 2 )  {
        throw new Error("Illegal board: Non-linear path found")
      }
    }
  }
  Object.values(colors).forEach((cnt) => {
    if ( cnt > 2 ) {
      throw new Error("Illegal board: multiple cluster with same color found")
    }
  })
  return ret
}
