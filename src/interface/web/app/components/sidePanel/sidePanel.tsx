'use client';

import styles from "./sidePanel.module.css";

import React, { useEffect, useState } from "react";

import { UserProfile, useAuthenticatedData } from "@/app/common/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, House, StackPlus, UserCirclePlus } from "@phosphor-icons/react";
import Link from "next/link";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";


interface UserProfileProps {
    userProfile: UserProfile;
    connected?: boolean;
    collapsed: boolean;
}

export function UserProfileComponent(props: UserProfileProps) {
    if (props.collapsed) {
        return (
            <div className={styles.profile}>
                <Avatar className="h-7 w-7">
                    <AvatarImage src={props.userProfile.photo} alt="user profile" />
                    <AvatarFallback>
                        {props.userProfile.username[0]}
                    </AvatarFallback>
                </Avatar>
            </div>
        );
    }

    return (
        <div className={styles.profile}>
            <Link href="/configure">
                <Avatar>
                    <AvatarImage src={props.userProfile.photo} alt="user profile" />
                    <AvatarFallback>
                        {props.userProfile.username[0]}
                    </AvatarFallback>
                </Avatar>
            </Link>
            <div className={styles.profileDetails}>
                <p>{props.userProfile?.username}</p>
                {/* Connected Indicator */}
                <div className="flex gap-2 items-center">
                    <div className={`inline-flex h-4 w-4 rounded-full opacity-75 ${props.connected ? 'bg-green-500' : 'bg-rose-500'}`}></div>
                    <p className="text-muted-foreground text-sm">
                        {props.connected ? "Connected" : "Disconnected"}
                    </p>
                </div>
            </div>
        </div>
    );
}

interface SessionsAndFilesProps {
    userProfile: UserProfile | null;
    connected?: boolean;
}

function SessionsAndFiles(props: SessionsAndFilesProps) {
    return (
        <>
            {props.userProfile &&
                <UserProfileComponent userProfile={props.userProfile} connected={props.connected} collapsed={false} />
            }</>
    )
}

interface SidePanelProps {
    connected?: boolean;
    isMobileWidth: boolean;
}

export default function SidePanel(props: SidePanelProps) {
    const [enabled, setEnabled] = useState(false);

    const authenticatedData = useAuthenticatedData();

    return (
        <div className={`${styles.panel} ${enabled ? styles.expanded : styles.collapsed}`}>
            <div className="flex items-center justify-between">
                <img src="/khoj-logo.svg" alt="logo" className="w-16"/>
                {
                    authenticatedData && props.isMobileWidth ?
                        <Drawer open={enabled} onOpenChange={(open) => {
                            if (!enabled) setEnabled(false);
                            setEnabled(open);
                        }
                        }>
                            <DrawerTrigger><ArrowRight className="h-4 w-4 mx-2" weight="bold"/></DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader>
                                    <DrawerTitle>Sessions and Files</DrawerTitle>
                                    <DrawerDescription>View all conversation sessions and manage conversation file filters</DrawerDescription>
                                </DrawerHeader>
                                <div className={`${styles.panelWrapper}`}>
                                    <SessionsAndFiles
                                        connected={props.connected}
                                        userProfile={authenticatedData}
                                    />
                                </div>
                                <DrawerFooter>
                                    <DrawerClose>
                                        <Button variant="outline">Done</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                        :
                        <button className={styles.button} onClick={() => setEnabled(!enabled)}>
                            {enabled ? <ArrowLeft className="h-4 w-4" weight="bold"/> : <ArrowRight className="h-4 w-4 mx-2" weight="bold"/>}
                        </button>
                }
            </div>
            {
                authenticatedData && !props.isMobileWidth && enabled &&
                <div className={`${styles.panelWrapper}`}>
                    <SessionsAndFiles
                        connected={props.connected}
                        userProfile={authenticatedData}
                    />
                </div>
            }
            {
                !authenticatedData && enabled &&
                <div className={`${styles.panelWrapper}`}>
                    <Link href="/">
                        <Button variant="ghost"><House className="h-4 w-4 mr-1" />Home</Button>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost"><StackPlus className="h-4 w-4 mr-1" />New Conversation</Button>
                    </Link>
                    <Link href={`/login?next=${encodeURIComponent(window.location.pathname)}`}> {/* Redirect to login page */}
                        <Button variant="default"><UserCirclePlus className="h-4 w-4 mr-1"/>Sign Up</Button>
                    </Link>
                </div>
            }
        </div>
    );
}
