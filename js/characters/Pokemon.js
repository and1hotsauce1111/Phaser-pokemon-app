export default class Pokemon {
  constructor() {
    this.wildPokemon = null;
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
    return fetch(url).then(res => {
      if (!res.ok) throw new Error('獲取資源失敗');
      return res.json();
    })
  }

  async getWildPokemon() {
    try {
      const area = await this.getAreas();
      if (Object.keys(area).length) {
        const encounterPokemons = area.pokemon_encounters;
        const randomNum = Math.floor(Math.random() * encounterPokemons.length);
        const randomWildPokemon = encounterPokemons[randomNum];
        this.wildPokemon = await this.getPokemonInfo(randomWildPokemon.pokemon.url);
        const wildPokemonSpecies = await this.getPokemonSpecies(this.wildPokemon.species.url);
        const zhHantName = wildPokemonSpecies.names.find(name => name.language.name === 'zh-Hant');
        this.wildPokemon.zh_Hant_name = Object.keys(zhHantName).length ? zhHantName.name : '';
      }
    } catch (err) {
      console.log(err);
    }
  }

  init() {}
}
