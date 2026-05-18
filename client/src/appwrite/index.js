import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const client = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

async function syncAuthHeader() {
  const { data } = await client.auth.getSession();
  const token = data.session?.access_token;
  if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete axios.defaults.headers.common.Authorization;
}

const account = {
  async createEmailPasswordSession({ email, password }) {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await syncAuthHeader();
    return data.session;
  },
  async get() {
    await syncAuthHeader();
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) throw error || new Error("No active user");
    return { $id: data.user.id, email: data.user.email };
  },
  async deleteSession() {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    await syncAuthHeader();
  },
};

syncAuthHeader();

export { client, account };
