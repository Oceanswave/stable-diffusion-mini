// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  let url = 'http://retrieval-augmented-diffusion:5000/predictions';
  if (process.env.NODE_ENV === 'development') {
    url = 'http://localhost:5000/predictions';
  }

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(req.body),
  };

  console.dir(req.body);
  const result = await fetch(url, options);
  const data = await result.json();
  res.status(200).json(data);
}
