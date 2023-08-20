import { useGrid } from "react-hooks-grid";

const Cliente = ({ data }) => {
  const { grid, setGrid, rowCount } = useGrid(data);
  debugger;
  return (
    <table>
      {grid.rows.map((row) => (
        <tr>
          {row.cells.map((cell) => (
            <td>{cell.value}</td>
          ))}
        </tr>
      ))}
    </table>
  );
};
export default Cliente;
