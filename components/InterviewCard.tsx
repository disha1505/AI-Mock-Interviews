import React from 'react'
import dayjs from 'dayjs';
import Image from 'next/image';
import { getRandomInterviewCover } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechicons';

const InterviewCard = ({
    interviewId,
    userId,
    role,
    type,
    techStack,
    level,
    questions,
    finalized,
    createdAt
}: InterviewCardProps) => {
    const feedback = null as Feedback | null;
    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("MMM D, YYYY");
    const coverImage = React.useMemo(() => getRandomInterviewCover(), []);

    return (
        <div className="card-border w-[360px] max-sm:w-full min-h-96">
            <div className="card-interview">
                <div>
                    <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl- bg-light-600">
                        <p className="badge-text">{normalizedType}</p>
                    </div>
                    <Image 
                        src={coverImage} 
                        alt="cover image" 
                        width={90} 
                        height={90} 
                        className="rounded-full object-cover size-[90px]"
                    />
                    <h3 className="mt-5 capitalize">
                        {role} Interview
                    </h3>
                    <div className="flex flex-row gap-5 mt-3">
                        <div className="flex flex-row gap-2">
                            <Image src="/calendar.svg" alt="calendar" width={22} height={22}/>
                            <p>{formattedDate}</p>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Image src="/star.svg" alt="star" width={22} height={22}/>
                            <p>{feedback?.totalScore || '---'}/100 </p>
                        </div>
                    
                </div>
                <p className="line-clamp-2 mt-5">{feedback?.finalAssessment || "you haven't taken the interview yet. Take it now to improve your skills"}</p>
            </div>
            <div className="flex flex-row justify-between">
                <div>
                    <DisplayTechIcons techStack={techStack} />
                </div>
            </div>
            <Button className="btn-primary">
                <Link href={feedback
                    ? `/interviews/${interviewId}/feedback`
                    : `/interviews/${interviewId}`
                }>
                    {feedback ? "Check Feedback" : "View Interview"}
                </Link>
            </Button>
        </div>
        </div>
    );
};

export default InterviewCard;