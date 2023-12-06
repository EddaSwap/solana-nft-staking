import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TablePagination from "@material-ui/core/TablePagination";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";

import TableRow from "@material-ui/core/TableRow";
import styles from "./index.module.scss";

const useStyles = makeStyles({
  table: {
    minWidth: 600,
    color: "white",
    background: "black",
  },
});

function createData(rank, userItem) {
  return {
    rank,
    address: userItem.staker_address,
    total_stalked: userItem.no_nfts,
    points: userItem.points,
  };
}

const getTotalStaked = (numNFT) => {
  if (numNFT > 10) {
    return 10;
  }
  return numNFT;
};

function EnhancedTableHead(props) {
  return (
    <TableHead className={styles.tableHeader}>
      <TableRow>
        <TableCell align="center" className={styles.statTitle}>
          Rank
        </TableCell>
        <TableCell align="center" className={styles.statTitle}>
          User address
        </TableCell>
        <TableCell align="center" className={styles.statTitle}>
          Total Staked
        </TableCell>
        <TableCell align="center" className={styles.statTitle}>
          Points
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

export default function BasicTable(props) {
  const classes = useStyles();
  const data = props.data;

  const rows = [];
  for (let i = 0; i < data.length; i++) {
    rows.push(createData(i, data[i]));
  }

  const [page, setPage] = React.useState(0);

  const [rowsPerPage] = React.useState(20);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <TableContainer className={styles.statContainer}>
        <Table
          className={styles.statTable}
          aria-labelledby="tableTitle"
          size={"medium"}
          aria-label="enhanced table"
        >
          <div className={styles.tableWrapper}>
            <EnhancedTableHead classes={classes} />
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow key={row.rank}>
                      <TableCell align="center" className={styles.statItem}>
                        {row.rank + 1}
                      </TableCell>
                      <TableCell align="center" className={styles.statItem}>
                        <a
                          className={styles.userAddress}
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://solscan.io/account/${row.address}`}
                        >
                          {row.address}
                        </a>
                      </TableCell>
                      <TableCell align="center" className={styles.statItem}>
                        {getTotalStaked(row.total_stalked)}
                      </TableCell>
                      <TableCell align="center" className={styles.statItem}>
                        {row.points}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TablePagination
              className={styles.panigation}
              rowsPerPageOptions={[20]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
            />
          </div>
        </Table>
      </TableContainer>
    </div>
  );
}
