import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import { Mail, Search, Bell } from 'lucide-react';

const ComponentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">UI Components Showcase</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button isLoading>Loading</Button>
          <Button icon={Mail}>With Icon</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Inputs & Selects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <Input label="Default Input" placeholder="Type something..." />
          <Input label="With Icon" icon={Search} placeholder="Search..." />
          <Input label="Error State" error="This field is required" placeholder="Error..." />
          <Select 
            label="Select Option" 
            options={[
              { value: '1', label: 'Option 1' },
              { value: '2', label: 'Option 2' }
            ]} 
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Badges</h2>
        <div className="flex gap-2">
          <Badge variant="gray">Gray</Badge>
          <Badge variant="red">Red</Badge>
          <Badge variant="blue">Blue</Badge>
          <Badge variant="green">Green</Badge>
          <Badge variant="yellow">Yellow</Badge>
          <Badge variant="purple">Purple</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <Card.Header>
              <Card.Title>Card Title</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-600">The content of the card goes here. It is flexible.</p>
            </Card.Content>
            <Card.Footer>
              <Button size="sm">Action</Button>
            </Card.Footer>
          </Card>
          <Card noPadding>
             <div className="bg-gray-100 h-32 flex items-center justify-center">Image Placeholder</div>
             <div className="p-6">
                <h3 className="font-bold">Card without default padding</h3>
             </div>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Loaders</h2>
        <div className="flex items-center gap-4">
          <Loader size="sm" />
          <Loader size="md" />
          <Loader size="lg" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Modal</h2>
        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
        >
          <p className="text-gray-600 mb-6">
            This is a reusable modal component. You can put any content here.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
          </div>
        </Modal>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Empty State</h2>
        <EmptyState 
            icon={Bell} 
            title="No notifications" 
            description="You are all caught up! Check back later for new updates."
            actionLabel="Refresh"
            onAction={() => alert('Refreshed!')}
        />
      </section>
    </div>
  );
};

export default ComponentsPage;
