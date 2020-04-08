# particle-firebase-webhook-tutorial
Brief tutorial for firebase with webhooks

using source tutorial https://github.com/rickkas7/firebase_tutorial

## 0 :: Setting up firebase
1. [Create firebase project](https://console.firebase.google.com/) (if you already have a google account)
2. Create new database
3. Select rules for read and write to true
```
{
  /* Visit https://firebase.google.com/docs/database/security to learn more about security rules. */
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
