"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  topic: z.string().min(3, {
    message: "Topic must be at least 3 characters.",
  }).max(100, {
    message: "Topic must be at most 100 characters.",
  }),
});

interface TopicInputFormProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

export function TopicInputForm({ onSubmit, isLoading }: TopicInputFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values.topic);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mb-8">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">Enter Your Topic or Keyword</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., 'Healthy Vegan Recipes', 'AI in Marketing', 'Travel to Bali'" 
                  {...field} 
                  className="h-12 text-base shadow-sm focus:ring-2 focus:ring-primary/80"
                  aria-label="Topic or Keyword Input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full h-12 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Content"
          )}
        </Button>
      </form>
    </Form>
  );
}
