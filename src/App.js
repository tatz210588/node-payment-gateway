import Button from "./lib/components/Button";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        <Button
          value="0.1" //price of the item
          ownerAddress="0xE745C2Ab3A5D7CF284465F9F6c3Cb8E2f6a21fd4"
          chainId="137"
        />
      </header>
    </div>
  );
}

export default App;
