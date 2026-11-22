# MedGuardian Phase 2: Personalized Early-Warning System

## Goal
Upgrade the existing app into a working wearable-based early-warning prototype, preserving its pages, visual system, authentication, and existing records. Use real user-owned readings; label synthetic data clearly; present anomalies as monitoring signals, never diagnoses.

## Repository and database audit
- Existing app has authenticated dashboard, profiles, `health_vitals`, vital history, symptom scanner, AI analysis functions, and charts.
- The database currently has only `profiles`, `health_vitals`, and `symptom_conversations`. Vitals do not yet store sleep duration or data source; caregiver preferences, baselines, anomaly results, alerts, and import history are absent.
- Existing dashboard cards and weekly activity chart contain hard-coded demonstration values; early-warning views must instead use stored readings and show honest empty states.
- Keep existing risk-prediction and other pages intact; do not reuse their placeholder outputs as early-warning results.

## Implementation
1. **Secure records and settings:** Apply a Lovable Cloud migration for sleep duration/data source on vitals and user-owned baseline, anomaly, alert, caregiver-preference/notification, import-history, and backend detection-settings records. Grant only the required roles, enable RLS, and scope private records to the authenticated owner. Use the existing profile emergency contact; add an explicit in-app caregiver-notification preference.
2. **Baseline and detector:** Add a reusable, tested statistical engine for rolling personal averages and standard deviations over up to 14 days. Require 14 distinct days before declaring a baseline established. Detect personal deviations in heart rate, SpO2, blood pressure, sleep, steps, and other available measurements; store method, values, deviation, timestamp, severity, and plain-language explanation. Use a clearly identified statistical fallback (no Python ML runtime is present).
3. **Persistent alerts and notifications:** Add an authenticated Edge Function that validates the user session and request, reads/writes only that user's records under RLS, refreshes baselines, persists anomalies, and creates deduplicated alerts only after configurable persistence conditions (default three consecutive anomalous readings). Support acknowledgement/resolution and in-app caregiver notification history only; clearly state external email/SMS/WhatsApp delivery is not configured.
4. **Wearable inputs:** Add three labeled synthetic profiles (stable, gradual change, sudden anomaly) and an authenticated CSV workflow with validation, preview, valid-row import, and results. Synthetic readings will include a baseline period and a later change period where relevant so the workflow can demonstrate baseline, detection, persistence, and alerting using actual stored rows.
5. **Dashboard and history:** Replace hard-coded vitals/activity values with the signed-in user's stored readings; show baseline readiness/current comparisons, active alert summary, anomaly count, recent notification history, and last analysis time. Extend history with baseline references, anomaly/alert markers, date/metric/level filters, and alert details/actions.
6. **Safety and responsive polish:** Clearly label the prototype and synthetic data, avoid disease diagnoses or claims of emergency dispatch, and direct users to professional/emergency care when appropriate. Preserve the existing design system and motion style while supporting reduced motion and mobile layouts.

## Tests and verification
- Add focused tests for the 14-day baseline readiness rule, personalized standard-deviation detection, persistence threshold, deduplication, and CSV row validation.
- Run the project tests; verify the preview signed in with generated readings, baseline calculation, anomaly/persistence/alert creation, acknowledgement, alert history, caregiver in-app record, and CSV import.
- Verify RLS isolation between users and inspect current preview build/runtime diagnostics. External delivery and physical wearable integrations remain out of scope because credentials and hardware are not available.

## Technical details
- Reuse `health_vitals` and `profiles`; new private tables use `user_id` UUID ownership without new foreign keys to `auth.users`, plus foreign keys between application tables as appropriate.
- Keep the statistical engine in a shared, dependency-light module imported by both the Edge Function and unit tests. Configure detection/persistence thresholds in a backend settings record, not client-only constants.
- Keep all user-specific reads/writes behind authenticated RLS; no service-role key, AI key, or private health values in client logs.