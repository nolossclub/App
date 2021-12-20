import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { ethers } from "ethers";
import { useRecoilState } from "recoil";

import config from "../../utils/config";
import {
  useControllerContract,
  useBUSDContract,
  useNFTContract,
} from "./../../hooks/index";
import { useWeb3React } from "@web3-react/core";
import { formatEther } from "@ethersproject/units";
import styled from "@emotion/styled";
import { CustomModalBox, ContainerBox } from "../../utils/style";
import {
  tvlState,
  lottoState,
  totalNftsState,
  busdBalanceState,
} from "../../utils/states";
import { Alert, Snackbar } from "@mui/material";

const MAX_ALLOWANCE = ethers.BigNumber.from(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

const steps = ["Approve BUSD", "Enter Lotto"];

function Pool() {
  const { library, account } = useWeb3React();

  const controllerContract = useControllerContract();
  const busdContract = useBUSDContract(0);
  const nftContract = useNFTContract(0);

  const [tvl, setTvl] = useRecoilState(tvlState);
  const [lotto, setLotto] = useRecoilState(lottoState);
  const [busdBalance, setBusdBalance] = useRecoilState(busdBalanceState);
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

  useEffect(() => {
    let stale = false;
    const initLottoData = async () => {
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
      try {
        const busd = await busdContract.balanceOf(account);
        const busdFormatted = parseFloat(formatEther(busd.toString())).toFixed(
          0
        );
        if (!stale) {
          setBusdBalance(busdFormatted);
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
        const busdAllowance = await busdContract.allowance(
          account,
          config.CONTROLLER_CONTRACT_ADDRESS
        );

        if (!busdAllowance.eq(MAX_ALLOWANCE)) {
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
  }, [reload]);

  // Steppers
  const [activeStep, setActiveStep] = React.useState(0);

  const approve = async () => {
    try {
      const busdAllowance = await busdContract.allowance(
        account,
        config.CONTROLLER_CONTRACT_ADDRESS
      );

      if (busdAllowance.eq(MAX_ALLOWANCE)) {
        setActiveStep(1);
        return;
      }

      const approved = await busdContract.approve(
        config.CONTROLLER_CONTRACT_ADDRESS,
        MAX_ALLOWANCE
      );

      library.once(approved.hash, (done) => {
        if (done.status === 1) {
          setActiveStep(1);
          setNotification({
            show: true,
            type: "success",
            message: "BUSD Approved.",
          });
        } else {
          setNotification({
            show: true,
            type: "error",
            message: "BUSD approve failed.",
          });
        }
      });
    } catch (e) {
      setNotification({
        show: true,
        type: "error",
        message: "BUSD approve failed.",
      });
    }
  };

  const enterLotto = async () => {
    try {
      const entered = await controllerContract.mint({
        gasLimit: config.MAX_GAS_LIMIT,
      });

      library.once(entered.hash, (done) => {
        if (done.status === 1) {
          alert("Got 1 NFT.");
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

  return (
    <>
      <ContainerBox component="div">
        <Heading variant="h4" component="h4" align="center">
          Deposit BUSD, Get NFT ticket & Win Reward
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
                BUSD Balance
              </Typography>
              <Typography variant="p" component="p" align="center">
                {busdBalance} BUSD
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
                      Approve BUSD
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
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
  margin: 36px 8px;
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
