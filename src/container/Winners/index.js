import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { ContainerBox } from "../../utils/style";
import { formatETHAddress } from "./../../utils/index";
import config from "../../utils/config";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedTokenState, winnersState } from "../../utils/states";
import { formatEther } from "@ethersproject/units";
import TokenSelection from "../../components/TokenSelection";

function Winners() {
  const [winners, setWinners] = useRecoilState(winnersState);

  const selectedToken = useRecoilValue(selectedTokenState);

  useEffect(() => {
    let stale = false;
    const initData = async () => {
      try {
        let winnersList = await axios({
          url: config.thegraph[selectedToken],
          method: "post",
          data: {
            query: `
            {
              winners(first: 10) {
                id
                txn
                address
                amount
              }
            }
            `,
          },
        }).then((res) => res.data.data.winners);

        winnersList = winnersList.map((winner) => {
          winner.amount = parseFloat(formatEther(winner.amount)).toFixed(4);
          return winner;
        });

        if (!stale) {
          setWinners(winnersList);
        }
      } catch (e) {
        console.log(e);
      }
    };
    initData();
    return () => {
      stale = true;
    };
    // eslint-disable-next-line
  }, [selectedToken]);

  return (
    <>
      <ContainerBox>
        <TokenSelection />
        <TableContainer component={Paper} color="transparent">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Address</b>
                </TableCell>
                <TableCell align="right">
                  <b>Reward</b>
                </TableCell>
                <TableCell align="right">
                  <b>Txn</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {winners.map((row) => (
                <TableRow
                  key={JSON.stringify(row)}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <a
                      href={`https://www.bscscan.com/address/${row.address}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {formatETHAddress(row.address)}
                    </a>
                  </TableCell>
                  <TableCell align="right">${row.amount}</TableCell>
                  <TableCell align="right">
                    <a
                      href={`https://www.bscscan.com/tx/${row.txn}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ArrowRightAltIcon />
                    </a>
                  </TableCell>
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
