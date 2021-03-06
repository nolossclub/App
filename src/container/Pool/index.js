import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import { ethers } from "ethers";
import { useRecoilValue, useRecoilState } from "recoil";

import config from "../../utils/config";
import {
  getTokenContract,
  getControllerContract,
  getNFTContract,
} from "./../../hooks/index";
import { useWeb3React } from "@web3-react/core";
import { formatEther } from "@ethersproject/units";
import styled from "@emotion/styled";
import { CustomModalBox, ContainerBox } from "../../utils/style";
import {
  tvlState,
  lottoState,
  totalNftsState,
  tokenBalanceState,
  selectedTokenState,
} from "../../utils/states";
import { Alert, Snackbar } from "@mui/material";
import TokenSelection from "../../components/TokenSelection";

const MAX_ALLOWANCE = ethers.BigNumber.from(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

const LOTTO_AMOUNT = ethers.BigNumber.from("100");

function Pool() {
  const { library, account } = useWeb3React();

  const [tvl, setTvl] = useRecoilState(tvlState);
  const [lotto, setLotto] = useRecoilState(lottoState);
  const [tokenBalance, setTokenBalance] = useRecoilState(tokenBalanceState);
  const [totalNfts, setTotalNfts] = useRecoilState(totalNftsState);
  const [allowance, setAllowance] = useState(true);
  const [reload, setReload] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setActiveStep(0);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // Steppers
  const [activeStep, setActiveStep] = React.useState(0);

  const selectedToken = useRecoilValue(selectedTokenState);

  useEffect(() => {
    let stale = false;
    const initLottoData = async () => {
      const controllerContract = getControllerContract(
        library,
        config.controller[selectedToken],
        account
      );

      try {
        const tvl = await controllerContract.protocolBal();
        const tvlFormatted = parseFloat(formatEther(tvl)).toFixed(0);
        if (!stale) {
          setTvl(tvlFormatted);
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const lotto = await controllerContract.lotto();
        const lottoFormatted = parseFloat(formatEther(lotto)).toFixed(8);
        if (!stale) {
          setLotto(lottoFormatted);
        }
      } catch (e) {
        console.log(e);
      }
    };

    const initData = async () => {
      const tokenContract = getTokenContract(
        library,
        config.tokens[selectedToken],
        account
      );

      const nftContract = getNFTContract(
        library,
        config.nft[selectedToken],
        account
      );

      try {
        const token = await tokenContract.balanceOf(account);
        const tokenFormatted = parseFloat(
          formatEther(token.toString())
        ).toFixed(0);
        if (!stale) {
          setTokenBalance(tokenFormatted);
        }
      } catch (e) {
        console.log(e);
      }

      try {
        const totalNFTs = (await nftContract.balanceOf(account)).toString();

        if (!stale) {
          setTotalNfts(totalNFTs);
        }
      } catch (e) {
        console.log(e);
      }

      try {
        const tokenAllowance = await tokenContract.allowance(
          account,
          config.controller[selectedToken]
        );

        if (!tokenAllowance.gt(LOTTO_AMOUNT)) {
          setAllowance(false);
        }
      } catch (e) {
        console.log(e);
      }
    };

    initData();
    initLottoData();
    setInterval(() => {
      initLottoData();
    }, 10 * 1000);
    return () => {
      stale = true;
    };
    // eslint-disable-next-line
  }, [reload, selectedToken]);

  const approve = async () => {
    const tokenContract = getTokenContract(
      library,
      config.tokens[selectedToken],
      account
    );

    try {
      const tokenAllowance = await tokenContract.allowance(
        account,
        config.controller[selectedToken]
      );

      if (tokenAllowance.gt(LOTTO_AMOUNT)) {
        setActiveStep(1);
        return;
      }

      const approved = await tokenContract.approve(
        config.controller[selectedToken],
        MAX_ALLOWANCE
      );

      library.once(approved.hash, (done) => {
        if (done.status === 1) {
          setActiveStep(1);
          setNotification({
            show: true,
            type: "success",
            message: `${selectedToken} Approved.`,
          });
        } else {
          setNotification({
            show: true,
            type: "error",
            message: `${selectedToken} approve failed.`,
          });
        }
      });
    } catch (e) {
      setNotification({
        show: true,
        type: "error",
        message: `${selectedToken} approve failed.`,
      });
    }
  };

  const enterLotto = async () => {
    if (tokenBalance < 100) {
      setNotification({
        show: true,
        type: "error",
        message: `You don't have 100 ${selectedToken}.`,
      });
      return;
    }

    const controllerContract = getControllerContract(
      library,
      config.controller[selectedToken],
      account
    );

    try {
      const entered = await controllerContract.mint({
        gasLimit: config.MAX_GAS_LIMIT,
      });

      library.once(entered.hash, (done) => {
        if (done.status === 1) {
          setNotification({
            show: true,
            type: "success",
            message: "Received 1 lotto ticket.",
          });
          setReload(!reload);
        } else {
          setNotification({
            show: true,
            type: "error",
            message: "Failed to get lotto ticket.",
          });
        }

        setActiveStep(0);
        handleClose();
      });
    } catch (e) {
      setNotification({
        show: true,
        type: "error",
        message: "Failed to get lotto ticket.",
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

  const steps = [`Approve ${selectedToken}`, "Enter Lotto"];

  return (
    <>
      <ContainerBox component="div">
        <TokenSelection />
        <Heading variant="h4" component="h4" align="center">
          Deposit ${selectedToken}, Get NFT ticket & Win Reward
        </Heading>
        <InfoBox>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h5" align="center">
                ${tvl}
              </Typography>
              <Typography variant="p" component="p" align="center">
                Total Value Locked
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h5" align="center">
                ${lotto}
              </Typography>
              <Typography variant="p" component="p" align="center">
                Next Reward
              </Typography>
            </Grid>
          </Grid>
        </InfoBox>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <EntryBox>
              <Typography variant="b" component="b" align="center">
                {selectedToken} Balance
              </Typography>
              <Typography variant="p" component="p" align="center">
                {tokenBalance} {selectedToken}
              </Typography>
            </EntryBox>
            <EntryBox>
              <Typography variant="b" component="b" align="center">
                Tickets
              </Typography>
              <Typography variant="p" component="p" align="center">
                {totalNfts}
              </Typography>
            </EntryBox>
            <EntryBox>
              <Typography variant="b" component="b" align="center">
                Entry Amount
              </Typography>
              <Typography variant="p" component="p" align="center">
                $100
              </Typography>
            </EntryBox>
            <LottoButton
              fullWidth
              variant="contained"
              onClick={() => {
                if (allowance) {
                  enterLotto();
                } else {
                  handleOpen();
                }
              }}
            >
              Get Lotto Ticket
            </LottoButton>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <CustomModalBox>
                <StepperBox activeStep={activeStep}>
                  {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </StepperBox>
                {activeStep === 0 ? (
                  <React.Fragment>
                    <LottoButton
                      onClick={approve}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Approve {selectedToken}
                    </LottoButton>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <LottoButton
                      onClick={enterLotto}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Get Lotto Ticket
                    </LottoButton>
                  </React.Fragment>
                )}
              </CustomModalBox>
            </Modal>
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={notification.show}
          autoHideDuration={5000}
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

const EntryBox = styled.div`
  padding: 8px 16px;
  background: rgba(15, 15, 15, 0.2);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
`;

const LottoButton = styled(Button)`
  height: 70px;
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 8px 0 !important;
  background-image: linear-gradient(
    to right,
    #f3904f 0%,
    #3b4371 51%,
    #f3904f 100%
  );

  transition: 0.5s;
  background-size: 200% auto;
  box-shadow: 0 0 10px #333;
  border-radius: 10px;
  display: block;

  &:hover {
    background-position: right center; /* change the direction of the change here */
    color: #fff;
    text-decoration: none;
  }
`;

const Heading = styled(Typography)`
  margin: 36px 0;
  font-weight: 700;
`;

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

const StepperBox = styled(Stepper)`
  padding: 24px 0;
`;

export default Pool;
