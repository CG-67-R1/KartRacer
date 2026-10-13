# Apple Developer setup — KartRacer

Professional path for Certificates, Identifiers & Profiles + EAS-managed signing.

## Seller / developer name

**Do not** create a Development provisioning profile named after yourself and treat that as the public developer name.

| Concept | Correct value |
|--------|----------------|
| Public seller name | Apple Developer Program membership entity (Individual = legal name) |
| App display name | KartRacer - Motorsport_Is_Life |
| Bundle ID | `com.milkartracer.app` |
| ASC Apple ID | `6815476086` |
| Profile names | `KartRacer Development` / `KartRacer App Store` (purpose labels only) |

Confirm membership: [developer.apple.com/account](https://developer.apple.com/account) → Membership details.

| Field | Value |
|--------|--------|
| Team ID | `UAWP5NV4NQ` |
| Program | Apple Developer Program |
| Enrolled as | **Individual** |

Public seller name on the App Store is your **legal name**, not “KartRacer”.

## Expo

| Item | Value |
|------|--------|
| Expo account | [motorsport-is-life](https://expo.dev/accounts/motorsport-is-life) |
| EAS project | `@motorsport-is-life/kartracer` (`35684a13-12fc-4ec6-b561-553ee80c550a`) |
| Apple Team ID | `UAWP5NV4NQ` |

### Progress

| Step | Status |
|------|--------|
| Membership (Individual, Team `UAWP5NV4NQ`) | Done |
| Expo account + KartRacer EAS project | Done |
| App ID `com.milkartracer.app` | Done |
| ASC app **KartRacer - Motorsport_Is_Life** | Done (`6815476086`) |
| EAS Distribution cert + App Store profile | **Not yet** — first interactive production build |
| EAS iOS production IPA | **Not yet** |

### First production build (required once)

```powershell
cd C:\KartRacer\app
npx eas-cli@latest build -p ios --profile production --auto-submit --no-wait
```

When prompted:
- Use **remote / EAS-managed** credentials
- Team **UAWP5NV4NQ**
- Bundle ID **com.milkartracer.app**
- Allow EAS to create the **Apple Distribution** certificate and **App Store** provisioning profile

Non-interactive build cannot create that first cert. Submit checklist: [`ASC_SUBMIT_CHECKLIST.md`](ASC_SUBMIT_CHECKLIST.md).

## Secrets

Never commit `.p8`, `.p12`, or provisioning profiles. See repo `.gitignore`.
