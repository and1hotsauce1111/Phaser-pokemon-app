export default class Pokemon {
  constructor() {
    this.wildPokemonInfo = null;
    this.playerInitPokemon = null;
  }

  async getAreas() {
    return fetch("https://pokeapi.co/api/v2/location-area/581/").then((res) => {
      if (!res.ok) throw new Error("獲取資源失敗");
      return res.json();
    });
  }

  async getPokemonInfo(url) {
    return fetch(url).then((res) => {
      if (!res.ok) throw new Error("獲取資源失敗");
      return res.json();
    });
  }

  async getPokemonSpecies(url) {
    return fetch(url).then((res) => {
      if (!res.ok) throw new Error("獲取資源失敗");
      return res.json();
    });
  }

  async getPlayerInitPokemon() {
    try {
      const getPokemonResponse = await fetch(
        "https://pokeapi.co/api/v2/pokemon/lucario"
      );
      const pokemonInfo = await getPokemonResponse.json();
      const getPokemonSpeciesResponse = await fetch(pokemonInfo.species.url);
      const pokemonSpecies = await getPokemonSpeciesResponse.json();

      this.playerInitPokemon = await this.mapPokemonData(pokemonInfo, pokemonSpecies);
      // this.playerInitPokemon = this.mapPokemonData(pokemonInfo, pokemonSpecies);
    } catch (err) {
      console.log(err);
    }
  }

  async getWildPokemon() {
    try {
      const area = await this.getAreas();
      if (Object.keys(area).length) {
        // 取得地區野生pokemon 並隨機選取其一
        const encounterPokemons = area.pokemon_encounters;
        const randomNum = Math.floor(Math.random() * encounterPokemons.length);
        const randomWildPokemon = encounterPokemons[randomNum];

        // 取得野生pokemon 資訊
        const wildPokemon = await this.getPokemonInfo(
          randomWildPokemon.pokemon.url
        );
        const wildPokemonSpecies = await this.getPokemonSpecies(
          wildPokemon.species.url
        );
        // mapping data
        this.wildPokemonInfo = await this.mapPokemonData(
          wildPokemon,
          wildPokemonSpecies
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  async mapPokemonData(info, species) {
    // base_experience, stats/hp, moves, name
    let pokemonInfo = {};
    // pokemon name in zh_tw/en
    const zhHantName = species.names.find(
      (name) => name.language.name === "zh-Hant"
    );
    pokemonInfo.zh_Hant_name = Object.keys(zhHantName).length
      ? zhHantName.name
      : "";
    pokemonInfo.name = info.name;
    pokemonInfo.level = 5;
    // get pokemon moves
    const movesArray = info.moves.slice(0, 4);

    return Promise.all(
      movesArray.map((move) => fetch(move.move.url).then((res) => res.json()))
    ).then((moves) => {
      pokemonInfo.moves = moves;
      // move pp
      let movePP = {};
      moves.forEach((move) => {
        const moveName =
          move.names.find((name) => name.language.name === "zh-Hant").name ||
          move.name;
        movePP[moveName] = move.pp;
      });
      pokemonInfo.movePP = movePP;

      // sprites
      pokemonInfo.sprites = info.sprites;
      // stats
      pokemonInfo.maxHp = info.stats.find(
        (stat) => stat.stat.name === "hp"
      ).base_stat;
      pokemonInfo.currentHp = info.stats.find(
        (stat) => stat.stat.name === "hp"
      ).base_stat;
      // types
      pokemonInfo.types = info.types;
      // base exp
      pokemonInfo.baseExp = info.base_experience;

      return pokemonInfo;
    });
  }

  init() {}
}
