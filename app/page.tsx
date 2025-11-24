"use client";

import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  UserPlus,
  UserMinus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  mockDataStore,
  type Tweet,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function Home() {
  const [tweets, setTweets] = useState<Tweet[]>(mockDataStore.getTweets());
  const [newTweetContent, setNewTweetContent] = useState("");
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");
  const currentUser = mockDataStore.getCurrentUser();
  const allUsers = mockDataStore.getAllUsers();

  const timelineTweets = useMemo(() => {
    if (activeTab === "following") {
      return mockDataStore.getTimelineTweets();
    }
    return tweets;
  }, [activeTab, tweets]);

  const handleCreateTweet = () => {
    if (!newTweetContent.trim()) return;

    mockDataStore.createTweet(newTweetContent.trim());
    setTweets(mockDataStore.getTweets());
    setNewTweetContent("");
  };

  const handleToggleLike = (tweetId: string) => {
    mockDataStore.toggleLike(tweetId);
    setTweets(mockDataStore.getTweets());
  };

  const handleToggleRepost = (tweetId: string) => {
    mockDataStore.toggleRepost(tweetId);
    setTweets(mockDataStore.getTweets());
  };

  const handleToggleFollow = (userId: string) => {
    mockDataStore.toggleFollow(userId);
    setTweets([...tweets]); // Trigger re-render
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Content */}
          <main className="lg:col-span-7">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Home</h1>
            </div>

            {/* Tabs */}
            <div className="mb-4 flex border-b">
              <button
                onClick={() => setActiveTab("for-you")}
                className={cn(
                  "flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === "for-you"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                For You
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={cn(
                  "flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === "following"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Following
              </button>
            </div>

            {/* Tweet Composer */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Avatar className="size-10">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
                    <AvatarFallback>{getInitials(currentUser.displayName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="What's happening?"
                      value={newTweetContent}
                      onChange={(e) => setNewTweetContent(e.target.value)}
                      className="min-h-24 resize-none border-0 bg-transparent text-base focus-visible:ring-0"
                      maxLength={280}
                    />
                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className={cn(
                          "text-xs text-muted-foreground",
                          newTweetContent.length > 260 && "text-orange-500",
                          newTweetContent.length >= 280 && "text-red-500"
                        )}
                      >
                        {newTweetContent.length}/280
                      </span>
                      <Button
                        onClick={handleCreateTweet}
                        disabled={!newTweetContent.trim() || newTweetContent.length > 280}
                        size="sm"
                      >
                        <Send className="size-4" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <div className="space-y-4">
              {timelineTweets.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Sparkles className="mb-4 size-12 text-muted-foreground" />
                    <p className="text-muted-foreground">No tweets yet. Start the conversation!</p>
                  </CardContent>
                </Card>
              ) : (
                timelineTweets.map((tweet) => {
                  const user = mockDataStore.getUser(tweet.userId);
                  if (!user) return null;

                  const isLiked = mockDataStore.isLiked(tweet.id);
                  const isReposted = mockDataStore.isReposted(tweet.id);

                  return (
                    <Card key={tweet.id} className="hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <Avatar className="size-10 shrink-0">
                            <AvatarImage src={user.avatar} alt={user.displayName} />
                            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{user.displayName}</span>
                              <span className="text-muted-foreground text-sm">
                                @{user.username}
                              </span>
                              <span className="text-muted-foreground text-sm">·</span>
                              <span className="text-muted-foreground text-sm">
                                {formatTime(tweet.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap break-words">
                              {tweet.content}
                            </p>
                            <div className="flex items-center gap-6">
                              <button
                                onClick={() => handleToggleLike(tweet.id)}
                                className={cn(
                                  "flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors",
                                  isLiked && "text-red-500"
                                )}
                              >
                                <Heart
                                  className={cn(
                                    "size-5 transition-colors",
                                    isLiked && "fill-current"
                                  )}
                                />
                                <span className="text-sm">{tweet.likes}</span>
                              </button>
                              <button
                                className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors"
                              >
                                <MessageCircle className="size-5" />
                                <span className="text-sm">{tweet.replies}</span>
                              </button>
                              <button
                                onClick={() => handleToggleRepost(tweet.id)}
                                className={cn(
                                  "flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors",
                                  isReposted && "text-green-500"
                                )}
                              >
                                <Repeat2
                                  className={cn(
                                    "size-5 transition-colors",
                                    isReposted && "fill-current"
                                  )}
                                />
                                <span className="text-sm">{tweet.reposts}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-5">
            <div className="sticky top-6 space-y-6">
              {/* Current User Profile */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-16">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
                      <AvatarFallback className="text-lg">
                        {getInitials(currentUser.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{currentUser.displayName}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        @{currentUser.username}
                      </p>
                      {currentUser.bio && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {currentUser.bio}
                        </p>
                      )}
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {currentUser.following}
                          </span>{" "}
                          Following
                        </span>
                        <span className="text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {currentUser.followers}
                          </span>{" "}
                          Followers
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Who to Follow */}
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Who to Follow</h2>
                  <div className="space-y-4">
                    {allUsers
                      .filter((user) => user.id !== currentUser.id)
                      .slice(0, 3)
                      .map((user) => {
                        const isFollowing = mockDataStore.isFollowing(user.id);
                        return (
                          <div key={user.id} className="flex items-center gap-3">
                            <Avatar className="size-10">
                              <AvatarImage src={user.avatar} alt={user.displayName} />
                              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{user.displayName}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                @{user.username}
                              </p>
                              {user.bio && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                  {user.bio}
                                </p>
                              )}
                            </div>
                            <Button
                              variant={isFollowing ? "outline" : "default"}
                              size="sm"
                              onClick={() => handleToggleFollow(user.id)}
                              className="shrink-0"
                            >
                              {isFollowing ? (
                                <>
                                  <UserMinus className="size-4" />
                                  <span className="hidden sm:inline">Unfollow</span>
                                </>
                              ) : (
                                <>
                                  <UserPlus className="size-4" />
                                  <span className="hidden sm:inline">Follow</span>
                                </>
                              )}
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Trending</h2>
                  <div className="space-y-3">
                    {[
                      { topic: "Next.js", posts: "12.5K" },
                      { topic: "TypeScript", posts: "8.2K" },
                      { topic: "React", posts: "15.3K" },
                      { topic: "Web Development", posts: "6.7K" },
                    ].map((trend, index) => (
                      <div key={index} className="cursor-pointer hover:bg-accent p-2 rounded-md transition-colors">
                        <p className="font-semibold text-sm">{trend.topic}</p>
                        <p className="text-xs text-muted-foreground">{trend.posts} posts</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
