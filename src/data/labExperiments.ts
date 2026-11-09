import type { LabExperiment } from '@/types'

/**
 * THE LAB LEDGER — also empty by choice.
 *
 * The lab is a notebook, not a showcase. Entries are only written when an
 * experiment actually ran, and fields with no real data (date, version) are
 * omitted rather than invented. The page ships with a designed empty ledger.
 *
 * ── HOW TO ADD AN ENTRY ──────────────────────────────────────────────────────
 *   {
 *     id: 'flowfield-v1',
 *     title: { en: 'Flow-field v1', zh: '流场 v1' },
 *     type: { en: 'Generative Visual', zh: '生成视觉' },
 *     status: 'experiment',   // idea | experiment | prototype | in-progress | completed
 *     description: { en: '…', zh: '…' },
 *     version: 'v0.3',        // optional — hidden if absent
 *     date: '2026-11',        // optional — hidden if absent
 *     coverHue: 152,          // optional seed for the generated thumbnail
 *   }
 * ────────────────────────────────────────────────────────────────────────────
 */
export const labExperiments: LabExperiment[] = []
