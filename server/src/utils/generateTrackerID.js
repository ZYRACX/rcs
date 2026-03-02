import crypto from "crypto"

export default function generateTrackerID() {
  return crypto.randomBytes(32).toString()
}