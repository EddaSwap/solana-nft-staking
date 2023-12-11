import axios from "axios";

const API_ENDPOINT = process.env.REACT_APP_BACKEND_URL;

const sendBurnInfo = async ({ txHash, name, phone, address, postCode, country }) => {
  const data = JSON.stringify([
    {
      txHash,
      name,
      phone,
      address,
      postCode,
      country
    },
  ]);
  const config = {
    method: "post",
    url: `${API_ENDPOINT}/v1/burn/burn-nfts`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  const response = await axios(config);

  return response.data;
};

export { sendBurnInfo }