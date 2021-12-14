import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ContainerBox } from "../../utils/style";
import { useNFTContract } from "./../../hooks/index";
import { formatETHAddress } from "./../../utils/index";

function createData(address, ticketNumber, prize) {
  return { address, ticketNumber, prize };
}

const rows = [
  createData("0xaff4a54a3ecfbb7ea8c9ed90b88b1b7819145eeb", 159, 1206),
  createData("0x756f14dcb224f270a2d4c4e8519acb15b2b8c41b", 237, 902),
  createData("0xe2b990a6397453b3c3d8ea1b096acc22fa97ee6b", 262, 16000),
  createData("0x54bee98e4e23ff52be4ca93200a9aab41c721d39", 305, 3000),
];

function Winners() {
  const nftContract = useNFTContract();

  useEffect(() => {
    let stale = false;
    const initData = async () => {
      if (!stale) {
      }
    };
    initData();
    return () => {
      stale = true;
    };
  }, [nftContract]);

  return (
    <>
      <ContainerBox>
        <TableContainer component={Paper} color="transparent">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Address</b>
                </TableCell>
                <TableCell align="right">
                  <b>Ticket #</b>
                </TableCell>
                <TableCell align="right">
                  <b>Reward</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={JSON.stringify(row)}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {formatETHAddress(row.address)}
                  </TableCell>
                  <TableCell align="right">{row.ticketNumber}</TableCell>
                  <TableCell align="right">${row.prize}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ContainerBox>
    </>
  );
}

export default Winners;
