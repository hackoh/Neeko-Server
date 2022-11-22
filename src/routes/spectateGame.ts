import { SpectatorManager } from "../SpectatorManager";

export default async function routes(fastify) {
    fastify.get('/spectate/:region/games/:gameId', async (request, reply) => {
        const region = request.params.region;
        const gameId = request.params.gameId;
        
        if (!region || !gameId) {
            reply.code(400).send("Missing parameters");
            return;
        }
        if (!fastify.spectator_servers[region]) {
            reply.code(400).send("Invalid region");
            return;
        }

        if(fastify.secrets.check_spectate_secret && fastify.secrets.spectate_secret !== request.headers.secret){
            reply.code(403).send("Invalid secret");
            return;
        }

        if(await SpectatorManager.getInstance().spectateByGameId(gameId, region)){
            reply.code(200).send(`Spectating ${gameId}.`);
        }else{
            reply.code(200).send(`Summoner ${gameId} not in game or not found.`);
        }
    });
}