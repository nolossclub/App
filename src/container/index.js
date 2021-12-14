import React from "react";
import Container from "@mui/material/Container";

import Header from "../components/Header";
import Web3Wrapper from "./../components/Web3Wrapper";
import { Route, Routes } from "react-router-dom";
import Pool from "./Pool";
import Account from "./account/index";
import Winners from "./Winners/index";
import BottomNav from "./../components/BottomNav";

const Home = () => {
  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Web3Wrapper>
          <Routes>
            <Route exact path="/" element={<Pool />} />
            <Route exact path="/account" element={<Account />} />
            <Route exact path="/winners" element={<Winners />} />
          </Routes>
        </Web3Wrapper>
      </Container>
      <BottomNav />
    </>
  );
};

export default Home;
