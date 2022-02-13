export default class Pokemon {
  constructor() {
    this.wildPokemonInfo = null;
  }

  async getAreas() {
    return fetch('https://pokeapi.co/api/v2/location-area/581/').then((res) => {
      if (!res.ok) throw new Error('獲取資源失敗');
      return res.json();
    });
  }

  async getPokemonInfo(url) {
    return fetch(url).then((res) => {
      if (!res.ok) throw new Error('獲取資源失敗');
      return res.json();
    });
  }

  async getPokemonSpecies(url) {
    return fetch(url).then((res) => {
      if (!res.ok) throw new Error('獲取資源失敗');
      return res.json();
    });
  }


  async getWildPokemon() {
    try {
      // 需要資料 寶可夢名字 HP Exp Moves sprites
      const area = await this.getAreas();
      if (Object.keys(area).length) {
        // 取得地區野生pokemon 並隨機選取其一
        const encounterPokemons = area.pokemon_encounters;
        const randomNum = Math.floor(Math.random() * encounterPokemons.length);
        const randomWildPokemon = encounterPokemons[randomNum];

        // 取得野生pokemon 資訊
        const wildPokemon = await this.getPokemonInfo(
          randomWildPokemon.pokemon.url,
        );
        const wildPokemonSpecies = await this.getPokemonSpecies(
          wildPokemon.species.url,
        );
        // mapping data
        this.wildPokemonInfo = await this.mapWildPokemonData(wildPokemon, wildPokemonSpecies);
        console.log(this.wildPokemonInfo);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async mapWildPokemonData(info, species) {
    // base_experience, stats/hp, moves, name
    let pokemonInfo = {};
    // pokemon name in zh_tw/en
    const zhHantName = species.names.find(
      (name) => name.language.name === 'zh-Hant',
    );
    pokemonInfo.zh_Hant_name = Object.keys(zhHantName).length
      ? zhHantName.name
      : '';
    pokemonInfo.name = info.name;
    // get pokemon moves
    // pokemonInfo.moves = info.moves.slice(0, 4);
    const movesArray = info.moves.slice(0, 4);
    const moves = await Promise.all(movesArray.map(move => fetch(move.move.url).then(res => res.json()))).then(moves => {
      return moves;
    })
    pokemonInfo.moves = moves;
    // sprites
    pokemonInfo.sprites = info.sprites;
    // stats
    pokemonInfo.stats = info.stats;
    // types
    pokemonInfo.types = info.types;
    // base exp
    pokemonInfo.baseExp = info.base_experience;

    return pokemonInfo;
  }

  init() {}
}
