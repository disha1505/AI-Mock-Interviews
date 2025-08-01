import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { dummyInterviews } from '@/constants'
import InterviewCard from '@/components/InterviewCard'
const page = () => {
  return (
    <>
    <section className ="card-cta">
      <div className ="flex flex-col gap-6 max-w-lg">
        <h2>
          Get Interview-Ready with Ai-Powered Practice and Feedback 
        </h2>
        <p  className="text-lg">
          Practice on real interview questions and get instant feedback to improve your skills.
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
      </div>
      <Image src="/robot.png" alt="robot-dude" width={400} height={400} className="max-sm:hidden"/>

    </section>
    <section className = "flex flex-col gap-6 mt-8">
      <h2>Your Interviews</h2>
      <div className="interviews-section">
        {dummyInterviews.map((interview) => (
          <InterviewCard{...interview} key ={interview.id}/>
        ))}
      </div>

    </section>
    <section className="flex-col gap-6 mt-8">
      <h2> take an Interview</h2>
      <div className="interview-section">
      {dummyInterviews.map((interview) => (
          <InterviewCard {...interview} key ={interview.id}/>
        ))}
        {/* <p>You haven't taken any interviews yet.</p> */}
      </div>
    </section>
    </>
  )
}

export default page
