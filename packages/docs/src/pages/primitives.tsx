import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from '@flux-ui/react'

import { Section, Showcase } from './showcase'

export function PrimitivesPage() {
  return (
    <Section title="Primitives" intro="shadcn-style building blocks with our warm-editorial theme baked in.">
      <Showcase
        title="Button"
        description="Six variants and seven sizes, plus an asChild slot for polymorphism."
        code={`<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link</Button>`}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="link">Link</Button>
        </div>
      </Showcase>

      <Showcase
        title="Card"
        code={`<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>`}
      >
        <Card className="w-72">
          <CardHeader>
            <CardTitle>Project</CardTitle>
            <CardDescription>Single-column layout with header, content, and footer slots.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Drop any UI inside CardContent.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline">
              Open
            </Button>
          </CardFooter>
        </Card>
      </Showcase>

      <Showcase
        title="Input + Label"
        code={`<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="you@example.com" />`}
      >
        <div className="flex w-72 flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
      </Showcase>

      <Showcase
        title="Badge"
        code={`<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Critical</Badge>`}
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Critical</Badge>
        </div>
      </Showcase>

      <Showcase
        title="Avatar"
        code={`<Avatar>
  <AvatarFallback>OX</AvatarFallback>
</Avatar>`}
      >
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>OX</AvatarFallback>
          </Avatar>
          <Avatar className="size-12">
            <AvatarFallback>FL</AvatarFallback>
          </Avatar>
        </div>
      </Showcase>

      <Showcase
        title="Separator"
        code={`<Separator />
<Separator orientation="vertical" />`}
      >
        <div className="flex h-24 w-72 items-center justify-center gap-4">
          <div className="text-sm">Left</div>
          <Separator orientation="vertical" />
          <div className="text-sm">Right</div>
        </div>
      </Showcase>
    </Section>
  )
}
