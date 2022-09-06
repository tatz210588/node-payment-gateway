import Button from "./lib/components/Button";

export default function Home() {
  const price1 = 1256
  const price2 = 234
  return (
    <div>
      <header>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </header>

      <body className={`ml-20 text-9xl`}>
        <h1 className="ml-20 text-9xl">
          <table>
            <tr>
              <td style={{ width: '40%' }}><img style={{
                width: '30%', height: '30%'
              }} src="https://cdn.shopify.com/s/files/1/1684/4603/products/MacBookPro13_Mid2012_NonRetina_Silver.png" /></td>
              < td > $ &nbsp;{price1}</td>
              <td>
                <Button
                  value={price1}//price of the item in $
                  ownerAddress="0xE745C2Ab3A5D7CF284465F9F6c3Cb8E2f6a21fd4"
                  label="Pay with crypto"
                />
              </td>
            </tr>
            <tr>
              <td style={{ width: '40%' }}><img style={{
                width: '30%', height: '30%'
              }} src="http://i1.adis.ws/i/canon/eos-r5_front_rf24-105mmf4lisusm_32c26ad194234d42b3cd9e582a21c99b" /></td>
              <td>$&nbsp;{price2}</td>
              <Button
                value={price2}//price of the item in $
                ownerAddress="0xE745C2Ab3A5D7CF284465F9F6c3Cb8E2f6a21fd4"
                label="Pay with crypto"
              />
            </tr>
          </table>

          <div className="text-sm">

          </div>
        </h1>
      </body>
    </div>
  );
}
