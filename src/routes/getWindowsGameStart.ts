import { SpectatorManager } from "../SpectatorManager";

export default async function routes(fastify) {
    fastify.get('/windows/:region/:gameId', async (request, reply) => {
        const gameId = request.params.gameId;
        const region = request.params.region;
        if (!gameId || !region) {
            reply.code(400).send("Missing parameters");
            return;
        }
        try {
            const hostname = request.hostname;
            let address = hostname;
            let port = '';
            if(address.indexOf(':') !== -1){
                address = hostname.split(':')[0];
                port = hostname.split(':')[1];
            }

            const res = await SpectatorManager.getInstance().getWindowsGameStart(gameId, address, port, region);

            reply.header('Content-disposition', `attachment; filename=start_${region}_${gameId}.bat`);
            reply.send(res);
        } catch {
            reply.code(404).send(`Cannot find this game on this spectator server.`);
        }
    });
}