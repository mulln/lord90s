const API = {
  token: null,
  baseUrl: window.location.origin,

  setToken(t) {
    this.token = t;
  },

  async request(path, method = "GET", body = null) {
    const opts = {
      method,
      headers: {
        "Content-Type": "application/json",
      }
    };

    if (this.token) {
      opts.headers["Authorization"] = `Bearer ${this.token}`;
    }

    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${this.baseUrl}${path}`, opts);
    return res.json();
  },

  // auth
  register(data) { return this.request("/auth/register", "POST", data); },
  login(data) { return this.request("/auth/login", "POST", data); },

  // player
  me() { return this.request("/player/me"); },

  // actions
  explore() { return this.request("/actions/explore", "POST"); },

  // npc encounters
  getEncounter() { return this.request("/npc/encounter"); },
  chooseEncounter(tag) { return this.request("/npc/choose", "POST", { tag }); },

  // combat
  fightNPC() { return this.request("/combat/npc", "POST"); }
};

export default API;

