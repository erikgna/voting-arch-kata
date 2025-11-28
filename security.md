## (A) Browser Security is Weaker

- User devices may have malware, extensions, keyloggers, or hijacked browsers.

- Harder to protect cryptographic keys (no Secure Enclave by default).

- Web code can be manipulated (e.g., injected or modified if CSP is weak).

**Tradeoff:**
Web-only solutions are more accessible but less tamper-resistant than native apps.

## (B) Identity Verification is Harder

- WebAuthn/passkeys help, but not all users can use them.

- Social logins or SMS 2FA are weak for voting-level security.

**Tradeoff:**
The stronger the authentication (WebAuthn + government ID), the harder the UX.

## (C) Integrity of Delivered Code

- Browser loads JS every time → risk of:

- DNS hijack

- Supply-chain attacks

- Cache poisoning

- Malicious CDN injection

**Tradeoff:**
To secure code delivery, you need strict controls (CSP + SRI + immutability), which increases operational complexity.

## (D) End-to-End Vote Integrity

Votes must be validated server-side using:

- One-time voting tokens

- Server-side signature validation

- Ledger storage

**Tradeoff:**
The server must shoulder more cryptographic responsibility, shifting trust from the client to the backend.

## (E) Privacy vs. Fraud Prevention

- Voter secrecy

- No duplicate votes

- No link between identity and vote

**Tradeoff:**
The more you anonymize, the harder it is to validate uniqueness.
