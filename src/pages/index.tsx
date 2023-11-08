import { useClerk, useSession } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  const session = useSession();
  const { openSignIn } = useClerk();
  return (
    <div className="flex items-center justify-center w-full mx-auto">
    <div className="flex h-full flex-col  mx-auto justify-center gap-6 p-12">
      <div>
        {session.isSignedIn ? (
          <Link
            href={"/dashboard"}
            className="rounded-lg bg-gray-900 px-3 py-2 text-white transition duration-75 hover:bg-gray-800 active:scale-95"
          >
            Go to dashboard
          </Link>
        ) : (
          <button
            className="rounded-lg bg-gray-900 px-3 py-2 text-white transition duration-75 hover:bg-gray-800 active:scale-95"
            onClick={() => openSignIn()}
          >
            Sign in
          </button>
        )}
      </div>
      <article className="prose border-b pb-12">
        <h2>Welcome to Tractivity, an activity tracking solution.</h2>

        <p>
          Tractivity was founded when I began struggling to keep tabs on all of
          my extracurriculars and the notes app was not doing the job
        </p>

       

        <h3>Create activity sets (folders for your activities)</h3>
        <p>
          You can create activity sets that store your activities. For example
          you would not want your athletic achievements to be stored with your
          academic research.
        </p>

        <h3>Create activities</h3>
        <p>
          With Tractivity you can create an activity where you can store its
          name, description, start and end date, hours per week it was worked
          on, any images or PDFs (e.g. certificates), and any reflections you
          had on this activity.
        </p>
        <h3>Structuring</h3>
        <h4>Activity set</h4>
        <p>Amazon job application</p>
        <ul>
          <h4>Activities</h4>
          <li>Research Paper</li>
          <li>Amazon internship</li>
          <li>Toured Amazon headquarters</li>
          <li>Course on Amazon Web Services</li>
        </ul>
        <h4>Activity set</h4>

        <p>Activities for College application</p>
        <ul>
          <h4>Activities</h4>
          <li>Research Paper</li>
          <li>Amazon internship</li>
          <li>Captain of the soccer team</li>
          <li>Volunteered for a non-profit</li>
        </ul>
        <p>
          As you can see you can have an activity be in multiple sets, and a set
          can contain multiple activities (many-to-many relationship).
        </p>
      </article>
      <p > 
        Made by Kaveh Malekzadeh
      </p>
    </div>
</div>
  );
};

export default HomePage;
