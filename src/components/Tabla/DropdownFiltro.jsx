import { get } from "lodash";
import { Dropdown } from "semantic-ui-react";

const DropdownFiltro = ({ header, campo, tableData, setFiltro }) => {
  return (
    <Dropdown
      text={header}
      icon="filter"
      clearable
      options={[...new Set(tableData.map((row) => get(row, campo)))].map(
        (value) => ({ key: value, text: value, value })
      )}
      onChange={(event, selection) => {
        setFiltro(selection.value);
      }}
    />
  );
};

export default DropdownFiltro;
