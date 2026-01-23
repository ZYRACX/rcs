// const express = require("express");
// const bcrypt = require("bcrypt");
// const prisma = require("../../prisma"); // adjust path if needed

import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../prisma/index.js';

const router = express.Router();

/**
 * Discord registration / login
 * GET /discord?userId=xxx&username=yyy
 */
router.get("/discord", async (req, res) => {
  const { userId, username } = req.query;
  console.log("Discord userId:", userId);

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await prisma.user.upsert({
      where: {
        discord_uid: userId
      },
      update: {
        // optionally update username if it changes
        username: username ?? undefined
      },
      create: {
        discord_uid: userId,
        username
      }
    });

    return res.status(200).json({
      message: "User authenticated successfully",
      userId: user.userId
    });
  } catch (error) {
    console.error("Discord auth error:", error);
    return res.status(500).json({ error: "Database error" });
  }
});

/**
 * Normal email/password registration
 * POST /
 */
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hash
      }
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId: user.userId
    });
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma unique constraint violation
      return res.status(409).json({ error: "User already exists" });
    }

    console.error("Registration error:", error);
    return res.status(500).json({ error: "Database error" });
  }
});

export {router} ;
