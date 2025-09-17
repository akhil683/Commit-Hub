"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { ChevronRight, Github, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import GithubTokenForm from "@/components/form/GithubTokenForm";
import Link from "next/link";

const Guide = () => {
  const { data: session } = useSession();
  const { toast } = useToast();

  const createRepoMutation = useMutation({
    mutationFn: async () => {
      if (!session) {
        toast({
          title: "Un-Authorized !",
          description: "Please login to your account.",
          variant: "destructive",
        });
        return;
      }
      await axios.post("/api/create-repo", {
        user: session.user,
      });
    },
    onSuccess: () => {
      toast({
        title: "Created Successfully !",
        description: "'codetracking' private repository is created",
      });
    },
    onError: () => {
      toast({
        title: "Un-expected Error !",
        description: "An unexpected error occured",
        variant: "destructive",
      });
    },
  });

  const createWebhookMutation = useMutation({
    mutationFn: async () => {
      if (!session) {
        toast({
          title: "Un-Authorized !",
          description: "Please login you account.",
          variant: "destructive",
        });
        return;
      }
      await axios.post("/api/create-webhook", {
        user: session.user,
      });
    },
    onSuccess: () => {
      toast({
        title: "Created Successfully !",
        description: "Webhooks are created !",
      });
    },
    onError: () => {
      toast({
        title: "Un-expected Error !",
        description: "Un-successfull, please try again ",
        variant: "destructive",
      });
    },
  });

  return (
    <div>
      {/* Subscribe banner */}
      {(session?.user?.total_commits as number) > 2 &&
        session?.user.subscription && (
          <>
            <div className="flex max-md:flex-col max-md:text-center justify-between items-center my-8 bg-indigo-600 px-6 py-4 rounded-xl gap-4">
              <p className="md:text-xl text-lg text-center">
                You've reached the maximum commit limit for your current plan.
                Subscribe now to continue using the service seamlessly!
              </p>
              <Button
                type="submit"
                className="h-12 px-8 bg-white hover:bg-gray-300 text-black font-medium"
                asChild
              >
                <Link href={"/"}>Subscribe</Link>
              </Button>
            </div>
            <div className="h-[1px] bg-gray-700 my-8" />
          </>
        )}

      <h2 className="text-2xl md:text-3xl font-semibold">
        Step by Step guide to Automate Code Tracking
      </h2>
      <div className="h-[1px] bg-gray-700 my-8" />

      {/* Step 1: Github Access Token */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          1. Connect Your GitHub Account
        </h2>
        <p className="md:text-lg text-sm text-gray-300">
          Generate a personal access token on GitHub and connect your account to
          enable tracking.
        </p>
        <Accordion
          type="single"
          collapsible
          className="w-full border p-4 rounded-lg border-gray-700 bg-gray-800/30 my-6"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className=" flex gap-2 items-center font-semibold">
              <ChevronRight className="w-6 h-6" />
              <p className="text-start text-sm md:text-lg">
                How to generate Github Access Token ?
              </p>
            </AccordionTrigger>
            <AccordionContent className="mt-4">
              <ol className="list-decimal max-md:text-sm list-inside space-y-3 mb-4 text-gray-300">
                <li>Go to your GitHub Settings</li>
                <li>Click on "Developer settings" in the left sidebar</li>
                <li>
                  Select "Personal access tokens" and then "Tokens (classic)"
                </li>
                <li>
                  Click "Generate new token" and select "Generate new token
                  (classic)"
                </li>
                <li>Give your token a descriptive name</li>
                <li>
                  Give read and write access to following permissions:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>repo</li>
                    <li>user</li>
                    <li>admin:public_key</li>
                  </ul>
                </li>
                <li>
                  Click "Generate token" at the bottom of the page (we recommend
                  to set no expiry for this token)
                </li>
                <li>
                  Copy your new token (make sure to save it, as you won't be
                  able to see it again!)
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <GithubTokenForm />
      </div>

      {/* Step 2: Create Private Repository: "codetracking" */}
      <div className="h-[1px] bg-gray-700 my-8" />
      <div>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          2. Create Repository
        </h2>
        <p className="md:text-lg text-sm text-gray-300 mb-4">
          Create a private repository called code-tracking in your GitHub
          account. This repository will store mirrored commit messages from all
          your other repositories to ensure your contributions are logged on
          GitHub.
        </p>
        <Button
          disabled={createRepoMutation.isPending}
          onClick={() => createRepoMutation.mutate()}
          variant="outline"
          className="max-sm:w-full text-black"
        >
          {createRepoMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Github className="mr-2 h-4 w-4" />
          )}
          Create Repo
        </Button>
      </div>

      {/* Step 3: Create Webhook to all repositories */}
      <div className="h-[1px] bg-gray-700 my-8" />
      <div>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          3. Create Webhook
        </h2>
        <p className="md:text-lg text-sm text-gray-300 mb-4">
          Add webhooks to all your repositories. These webhooks will notify this
          app whenever you make a commit on any branch. The app will
          automatically mirror your commit messages to the code-tracking
          repository.
        </p>
        <Button
          disabled={createWebhookMutation.isPending}
          onClick={() => createWebhookMutation.mutate()}
          variant="outline"
          className="max-sm:w-full text-black"
        >
          {createWebhookMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Github className="mr-2 h-4 w-4" />
          )}
          Create Webhook
        </Button>
      </div>
    </div>
  );
};

export default Guide;
