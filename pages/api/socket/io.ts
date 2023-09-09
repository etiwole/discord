import {NextApiRequest} from "next";
import {NextApiResponseServerIo} from "@/type";
import {Server as NetServer} from "net";
import {Server as ServerIO} from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    // @ts-ignore
    res.socket.server.io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });
  }

  res.end();
}

export default ioHandler;