'use client'

import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const MessageCard = () => {
    return (
        <Card key={message.id} className="cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800" onClick={() => setSelectedMessage(message)}>
            <CardContent className="flex items-center justify-between p-4">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{message.date}</p>
                    <p className="text-gray-900 dark:text-white">{message.content.substring(0, 50)}...</p>
                </div>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(message.id); }} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </CardContent>
        </Card>
    );
};

export default MessageCard;