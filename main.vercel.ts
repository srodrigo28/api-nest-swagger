import { Handler } from '@netlify/functions';
import { createNestServer } from './main';

let server;

const handler: Handler = async (event, context) => {
  server = server ?? (await createNestServer());
  return server(event, context);
};

export { handler };
