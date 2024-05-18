import { MongoClient } from 'mongodb';

const client = new MongoClient(
  "mongodb://127.0.0.1:27017"
);
client
  .connect()
  .then(async (client) => {
    const Db = client.db("PokemonManager");
    const usersCollection = Db.collection("users");
    const gamesCollection = Db.collection("games");
    const users = usersCollection.find({})
    // @ts-ignore
    await users.forEach(async (user) => {
      for (const _id of user.games) {
        let game = await gamesCollection.findOne({_id})
        if (!game.players) {
          const players = [{ trainer: game.player, playingTime: game.playingTime, userId: user._id.toString() }];
          game.player = undefined;
          game.playingTime = undefined;
          game.players = players;
          gamesCollection.updateOne({ _id }, { $set: game }, { upsert: true });
        }
        gamesCollection.updateOne({ _id }, { $unset: {player:'', playingTime:''} }, { upsert: true });
      }
    })
  })