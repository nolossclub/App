import React, { useEffect, useState } from "react";

import Card from "@mui/material/Card";

import { useControllerContract, useNFTContract } from "./../../hooks/index";
import { useWeb3React } from "@web3-react/core";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import config from "../../utils/config";
import styled from "@emotion/styled";
import { useRecoilState } from "recoil";
import { Alert, Snackbar } from "@mui/material";

import { ContainerBox } from "../../utils/style";
import { totalTicketsState, userTicketsState } from "../../utils/states";

function Account() {
  const { library, account } = useWeb3React();
  const [userTickets, setUserTickets] = useRecoilState(userTicketsState);
  const [totalTickets, setTotalTickets] = useRecoilState(totalTicketsState);

  const controllerContract = useControllerContract();
  const nftContract = useNFTContract();

  const [reload, setReload] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    let stale = false;
    const initData = async () => {
      try {
        const totalSupply = await nftContract.totalSupply();
        const userTicketsList = [];
        let tickets = 0;
        for (let x = 0; x < totalSupply; x++) {
          const tokenId = await nftContract.tokenByIndex(x);
          const ticketOwner = await nftContract.ownerOf(tokenId);
          if (ticketOwner === account) {
            tickets++;
            const tokenUri = await nftContract.tokenURI(tokenId);
            userTicketsList.push({
              id: tokenId.toString(),
              tokenUri,
            });
          }
        }
        if (!stale) {
          setUserTickets(userTicketsList);
          setTotalTickets(tickets);
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
  }, [reload]);

  const burnToken = async (tokenId) => {
    try {
      const entered = await controllerContract.burn(tokenId, {
        gasLimit: config.MAX_GAS_LIMIT,
      });

      library.once(entered.hash, (done) => {
        if (done.status === 1) {
          setNotification({
            show: true,
            type: "success",
            message: "Lotto ticket burned.",
          });
          setReload(!reload);
        } else {
          setNotification({
            show: true,
            type: "error",
            message: "Lotto ticket burn failed.",
          });
        }
      });
    } catch (e) {
      setNotification({
        show: true,
        type: "error",
        message: "Lotto ticket burn failed.",
      });
    }
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({
      status: false,
      type: "success",
      message: "",
    });
  };

  return (
    <>
      <ContainerBox>
        <InfoBox>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h5" align="center">
                {totalTickets}
              </Typography>
              <Typography variant="p" component="p" align="center">
                Total Tickets
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h5" align="center">
                ${totalTickets * 100}
              </Typography>
              <Typography variant="p" component="p" align="center">
                Total Value
              </Typography>
            </Grid>
          </Grid>
        </InfoBox>
        <Grid container spacing={2} style={{ marginTop: 24 }}>
          {userTickets.map((row) => (
            <Grid key={row.id} item xs={12} md={6}>
              <TicketCard variant="outlined">
                <CardContent>
                  <a
                    href={`${row.tokenUri}.png`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Typography
                      sx={{ fontSize: 18, p: 1 }}
                      color="text.secondary"
                      align="center"
                      gutterBottom
                      variant="h5"
                      component="h5"
                    >
                      Ticket #{row.id}
                    </Typography>
                  </a>
                  <CardActions>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => burnToken(row.id)}
                      color="error"
                    >
                      Burn
                    </Button>
                  </CardActions>
                </CardContent>
              </TicketCard>
            </Grid>
          ))}
        </Grid>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={notification.show}
          autoHideDuration={6000}
          onClose={handleNotificationClose}
        >
          <Alert
            onClose={handleNotificationClose}
            severity={notification.type}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </ContainerBox>
    </>
  );
}

const InfoBox = styled.div`
  background: rgba(15, 15, 15, 0.2);
  border-radius: 10px;
  padding: 24px 8px;
  margin-bottom: 24px;
  h5 {
    font-weight: 700;
    font-size: 32px;
    color: #fed330;
  }
  p {
    font-size: 14px;
    color: #e3e3e3;
  }
`;

const TicketCard = styled(Card)`
  border-radius: 10px;
  border: 0;
  .MuiCardContent-root {
    padding: 4px;
    margin: 0;
  }
  h5 {
    font-size: 24px;
    font-family: "Paytone One", "Work Sans", -apple-system, BlinkMacSystemFont,
      "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
      "Droid Sans", "Helvetica Neue", sans-serif;
    color: #f1c40f;
    padding: 16px 0;
  }
`;

export default Account;
