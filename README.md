# Code Tracking App

A web application that helps developers keep their GitHub contribution graph updated, even for work done on branches other than `main`. The app automatically tracks commits from all repositories and mirrors them to a dedicated `code-tracking` repository. This ensures that every commit contributes to the user's contribution graph ("green dots") on GitHub.

---

## Features

- **GitHub Authentication**:
  - Users can sign in via GitHub using `next-auth` (Auth.js).
  
- **Automatic Repository Creation**:
  - Creates a private `code-tracking` repository in the user's GitHub account to centralize commit tracking.

- **Webhook Setup**:
  - Automatically sets up webhooks for all repositories in the user's GitHub account.
  - Listens for `push` events from all branches.

- **Commit Mirroring**:
  - Mirrors commit messages from any branch (other than `main`) to the `code-tracking` repository.
  - Commit messages follow the format: `[repo-name] user-commit-message`.

- **GitHub Contribution Graph Update**:
  - Ensures that every mirrored commit updates the user's contribution graph, even for work done outside the `main` branch.

- **Centralized Activity Log**:
  - The `code-tracking` repository serves as a log of all coding activity across multiple repositories.

---

## Technologies Used

- **Next.js (App Router)**: Framework for building the web app.
- **Auth.js (NextAuth)**: For GitHub authentication.
- **Webhooks**: To listen to GitHub `push` events.
- **Drizzle ORM**: Lightweight and type-safe ORM for database management (if applicable for advanced features like user settings).
- **Tailwind CSS**: For styling the user interface.
- **Octokit**: For interacting with the GitHub API.
- **Ngrok**: For testing webhooks in a local development environment.

---

## How It Works

### 1. User Authentication
- Users authenticate via GitHub OAuth using `next-auth`.
- Upon successful login:
  - The app retrieves an `accessToken` from GitHub.
  - This token is stored in the user's session for making API calls.

### 2. Repository Creation
- Users click the "Create Tracking Repo" button on the dashboard.
- The app calls the `create-repo` API route:
  - Checks if a `code-tracking` repository already exists.
  - If it doesn’t exist, the app creates a new private repository named `code-tracking`.

### 3. Webhook Setup
- Users click the "Create Webhooks" button on the dashboard.
- The app calls the `create-webhook` API route:
  - Fetches all repositories owned by the user.
  - For each repository, sets up a webhook that listens for `push` events.
  - The webhook is configured to send event data to the app's `handle-webhook` API route.

### 4. Webhook Handling
- When a user commits to any branch other than `main` in their repositories:
  - GitHub triggers the webhook.
  - The webhook sends the commit data to the `handle-webhook` API route.
  - The app processes the event and:
    - Formats the commit message as `[repo-name] user-commit-message`.
    - Pushes this commit to the `main` branch of the `code-tracking` repository.

### 5. Contribution Graph Update
- Each commit pushed to the `main` branch of the `code-tracking` repository is recognized by GitHub.
- This ensures the user's GitHub contribution graph remains updated with "green dots" for every commit.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akhil683/Commit-Hub.git
   cd Commit-Hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file and add the following environment variables:
   ```env
   AUTH_GITHUB_ID=your_github_client_id
   AUTH_GITHUB_SECRET=your_github_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   GITHUB_PERSONAL_ACCESS_TOKEN=your_personal_access_token
   ENCRYPT_KEY=your_encryption_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open the app in your browser:
   ```
   http://localhost:3000
   ```

6. Use **Ngrok** to test webhooks locally:
   - Install Ngrok:
     ```bash
     npm install -g ngrok
     ```
   - Start an Ngrok tunnel:
     ```bash
     ngrok http 3000
     ```
   - Copy the Ngrok URL and use it to configure webhook URLs in GitHub.

---

## Usage

### Dashboard Features:
- **Sign In with GitHub**: Log in to start using the app.
- **Create Tracking Repo**: Create the `code-tracking` repository in your GitHub account.
- **Create Webhooks**: Add webhooks to all repositories in your GitHub account.
- **View Contribution Graph**: Automatically updated with your activity across all repositories.

---

## Deployment

1. Deploy the app on **Vercel** or any other platform.
2. Set the environment variables in the production environment.
3. Update the GitHub OAuth application settings to use the deployed URL as the callback.

---

## Benefits

- **Consistent Contribution Graph**:
  - Tracks coding activity across all branches and repositories.
  - Ensures your GitHub profile accurately reflects your work.

- **Centralized Activity Log**:
  - Easily view your progress and contributions in one place.

- **Easy to Use**:
  - Simple dashboard with automated repository and webhook setup.

---

## Future Improvements

- Add a dashboard to display commit history directly from the `code-tracking` repository.
- Provide user settings for excluding specific repositories.
- Add support for other version control platforms like GitLab or Bitbucket.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you'd like to improve the app.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

