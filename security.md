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
To secure code delivery, need strict controls (CSP + SRI + immutability).

## (D) Privacy vs. Fraud Prevention

- Voter secrecy

- No duplicate votes

- No link between identity and vote

**Tradeoff:**
The more anonymized, the harder it is to validate uniqueness.

## 1. User Authentication

- Use WebAuthn with passkeys or hardware security keys (best). MFA

## 2. Secure Code Distribution

- Loaded via HTTPS
- Protected with Content-Security-Policy (CSP)
- Protected with Subresource Integrity (SRI)
- Served from immutable paths (e.g. /app.<hash>.js)

## 3. Vote Signing (Web Approach)

- Server issues a one-time signed voting token after authentication.

- Browser uses this token to submit the vote.

- Server verifies token signatures + uniqueness.

5. Immutable Storage

- Ledger database (QLDB)

- Ensures the vote cannot be altered.

6. DDoS + Network Protection

- CDN + WAF

- Bot detection

- mTLS optionally for admins

- Geo and residency rules
