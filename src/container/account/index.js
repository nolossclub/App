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

import { ContainerBox } from "../../utils/style";

function Account() {
  const { library, account } = useWeb3React();
  const [userTickets, setUserTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);

  const controllerContract = useControllerContract();
  const nftContract = useNFTContract();

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
  }, [nftContract, account]);

  const burnToken = async (tokenId) => {
    const entered = await controllerContract.burn(tokenId, {
      gasLimit: config.MAX_GAS_LIMIT,
    });

    library.once(entered.hash, (done) => {
      if (done.status === 1) {
        alert("NFT Burned.");
      } else {
        console.log("ERROR");
      }
    });
  };

  return (
    <>
      <ContainerBox>
        <InfoBox>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h4" align="center">
                {totalTickets}
              </Typography>
              <Typography variant="p" component="p" align="center">
                Total Tickets
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h4" align="center">
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
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    sx={{ fontSize: 18, p: 1 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Ticket #{row.id}
                  </Typography>
                  <CardActions>
                    <Button
                      variant="outlined"
                      onClick={() => burnToken(row.id)}
                      color="error"
                    >
                      Burn
                    </Button>
                    <Button
                      variant="link"
                      color="info"
                      target="_blank"
                      href={`${row.tokenUri}.png`}
                    >
                      Info
                    </Button>
                  </CardActions>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </ContainerBox>
    </>
  );
}

const InfoBox = styled.div`
  background: rgba(15, 15, 15, 0.2);
  border-radius: 10px;
  padding: 24px 8px;
  margin-bottom: 24px;
  h4 {
    font-weight: 600;
  }
  p {
    color: #e3e3e3;
  }
`;

export default Account;
