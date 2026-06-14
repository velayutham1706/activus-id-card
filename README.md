## Activus ID Card Generator

#### Process

- This system generates ID cards in bulk as a ZIP file if it contains multiple IDs otherwise just a single PDF.
- It can export the user details as a .csv file.
- A project should be created in order to generate ID cards and users must be added to the created project.
- Creator is going to request the ID card generation (pending state).
- Reviewer is going to accept the request (in review state).
- Approver is going to approve the request (approved state).
- Super admin is going to generate the ID card to download it directly or in bulk.

#### Roles

1. Super Admin
2. Approver
3. Reviewer
4. Creator
5. Users

#### To run

```
npm install

# to run the server (localhost:8080)
npm run dev
```
