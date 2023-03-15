import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { AI } from "./components/AI";
import { Counter } from "./components/Counter";
import { Jetton } from "./components/Jetton";
import { TransferTon } from "./components/TransferTon";
import { Button, FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import "@twa-dev/sdk";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const { network } = useTonConnect();

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <h1>MONETON by BL</h1>
        <Box>Test v 1.</Box>
        <FlexBoxRow>
          <TonConnectButton />
          <Button>
            {network
              ? network === CHAIN.MAINNET
                ? "mainnet"
                : "testnet"
              : "N/A"}
          </Button>
        </FlexBoxRow>
        <AI />
        <Counter />
        <TransferTon />
        <Jetton />
      </ThemeProvider>
    </>
  );
}

export default App;
